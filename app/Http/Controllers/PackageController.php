<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\NoReturn;

class PackageController extends Controller
{
    public function index()
    {
        $packages = SubscriptionPlan::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Packages/Index', [
            'packages' => $packages
        ]);
    }

    #[NoReturn]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:subscription_plans,name',
            'description' => 'required|string|in:jackpot,match,premium',
            'price' => 'required|numeric|min:0.01',
            'tips_count' => 'required|integer|min:1',
            'interval' => 'required|string|in:day,week,month',
            'status' => 'required|string|in:active,inactive',
            'currency' => 'string|max:3',
            'features' => 'nullable|array'
        ]);

        try {
            // Generate slug from name
            $slug = Str::slug($validated['name']);

            // Create the package
            $package = SubscriptionPlan::create([
                'name' => $validated['name'],
                'slug' => $slug,
                'price' => $validated['price'],
                'currency' => $validated['currency'] ?? 'KES',
                'interval' => $validated['interval'],
                'interval_count' => 1,
                'trial_days' => 0,
                'is_active' => $validated['status'] === 'active',
                'features' => $validated['features'] ?? []
            ]);

            return redirect()->back()->with('success', 'Package created successfully!')
                ->with('package', $package);

        } catch (\Exception $e) {
            \Log::error('Package creation failed: ' . $e->getMessage());

            return redirect()->back()
                ->withErrors(['message' => 'Failed to create package. Please try again.'])
                ->withInput();
        }
    }

    public function show($id)
    {
        $package = SubscriptionPlan::findOrFail($id);

        return Inertia::render('Admin/Packages/Show', [
            'package' => $package
        ]);
    }

    public function update(Request $request, $id)
    {
        $package = SubscriptionPlan::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|in:jackpot,match,premium',
            'price' => 'required|numeric|min:0.01',
            'interval' => 'required|string|in:day,week,month',
            'is_active' => 'required|boolean',
            'currency' => 'string|max:3',
            'features' => 'nullable|array'
        ]);

        try {
            // Update slug if name changed
            if ($package->name !== $validated['name']) {
                $slug = Str::slug($validated['name']);
                $originalSlug = $slug;
                $counter = 1;

                while (SubscriptionPlan::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                    $slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
                $validated['slug'] = $slug;
            }

            $package->update([
                'name' => $validated['name'],
                'slug' => $validated['slug'] ?? $package->slug,
                'price' => $validated['price'],
                'currency' => $validated['currency'] ?? $package->currency,
                'interval' => $validated['interval'],
                'features' => $validated['features'] ?? [
                        'category' => $validated['features']['category'],
                        'for' => $validated['features']['for'],
                        'label' => $validated['features']['label'],
                        'period_days' => $validated['features']['period_days'],
                        'tax' => $validated['features']['tax'],
                    ],
                'is_active' => $validated['is_active'],
            ]);

            return redirect()->back()->with('success', 'Package updated successfully!');

        } catch (\Exception $e) {
            \Log::error('Package update failed: ' . $e->getMessage());

            return redirect()->back()
                ->withErrors(['message' => 'Failed to update package. Please try again.'])
                ->withInput();
        }
    }


    public function destroy($id)
    {
        try {
            $package = SubscriptionPlan::findOrFail($id);

            // Check if package has active subscriptions
            if ($package->subscriptions()->where('status', 'active')->exists()) {
                return redirect()->back()
                    ->withErrors(['message' => 'Cannot delete package with active subscriptions.']);
            }

            $packageController = new PackageProcessController();

            if (array_key_exists($package->name, $packageController->planToGroups)) {
                return redirect()->back()
                    ->withErrors(['message' => 'Cannot delete A core package.']);
            }


            $package->delete();

            return redirect()->back();

        } catch (\Exception $e) {
            \Log::error('Package deletion failed: ' . $e->getMessage());

            return redirect()->back()
                ->withErrors(['message' => 'Failed to delete package. Please try again.']);
        }
    }
}

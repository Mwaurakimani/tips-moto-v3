import { Button } from '@/pages/tips-moto/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/tips-moto/components/ui/card';
import { Trash2 } from 'lucide-react';

export function PackageQuickActions({ onDeleteClick }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button 
                    onClick={onDeleteClick} 
                    className="flex w-full items-center justify-center space-x-2" 
                    variant="destructive"
                >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Package</span>
                </Button>
            </CardContent>
        </Card>
    );
}

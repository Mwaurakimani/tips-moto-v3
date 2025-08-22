import React from "react";

export default function DebugJson({ data }) {
    return (
        <pre className="bg-gray-900 text-green-400 text-sm p-4 rounded overflow-x-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
    );
}

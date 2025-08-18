// src/components/EditorComponent.tsx

"use client";

// --- THE FIX ---
// We now import useState to manage the code's state internally.
import React, { memo, useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { PrismTheme } from 'prism-react-renderer';
import * as THREE from 'three';
import ThreeJSHarness from '@/components/ThreeJSHarness';

interface EditorComponentProps {
    initialCode: string;
    editorCodeRef: React.MutableRefObject<string>;
    previewRef: React.RefObject<HTMLDivElement>;
}

const scope = { React, THREE, ThreeJSHarness };

const editorTheme: PrismTheme = {
    plain: { color: "#d4d4d4", backgroundColor: "#0f0f23" },
    styles: [
        { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#6a9955", fontStyle: "italic" } },
        { types: ["punctuation"], style: { color: "#d4d4d4" } },
        { types: ["property", "tag", "boolean", "number", "constant", "symbol", "deleted"], style: { color: "#b5cea8" } },
        { types: ["selector", "attr-name", "string", "char", "builtin", "inserted"], style: { color: "#ce9178" } },
        { types: ["operator", "entity", "url", "variable"], style: { color: "#d4d4d4" } },
        { types: ["at-rule", "attr-value", "keyword"], style: { color: "#569cd6" } },
        { types: ["function", "class-name", "maybe-class-name"], style: { color: "#dcdcaa" } },
        { types: ["regex", "important"], style: { color: "#d16969" } },
    ],
};

const EditorComponent = memo(function EditorComponent({ initialCode, editorCodeRef, previewRef }: EditorComponentProps) {
    // --- THE FIX ---
    // This component now has its own state for the code.
    // This state drives the real-time updates.
    const [code, setCode] = useState(initialCode);

    return (
        // The LiveProvider now gets its code from this component's internal state.
        <LiveProvider code={code} scope={scope} theme={editorTheme} noInline={true}>
            <div className="flex flex-grow h-full overflow-hidden">
                {/* Editor Column */}
                <div className="w-1/2 h-full flex flex-col border-r border-[#2d1b69]">
                    <div className="p-4 bg-[#1a0033]">
                        <h2 className="text-xl font-bold font-orbitron">Code Editor</h2>
                        <p className="text-sm text-gray-400">Create your masterpiece in the `MyCreativeBlob` class.</p>
                    </div>
                    <div className="flex-grow relative">
                        <LiveEditor
                            // --- THE FIX ---
                            // onChange now does TWO things:
                            // 1. Updates the internal state (`setCode`) to trigger the real-time preview.
                            // 2. Updates the ref (`editorCodeRef`) so the parent page can get the code for submission.
                            onChange={(newCode) => {
                                setCode(newCode);
                                editorCodeRef.current = newCode;
                            }}
                            className="!absolute !inset-0 !w-full !h-full p-4 overflow-auto text-base font-mono"
                        />
                    </div>
                </div>
                {/* Preview Column */}
                <div className="w-1/2 h-full relative flex flex-col">
                    <div className="p-4 bg-[#1a0033] border-b border-[#2d1b69]">
                        <h2 className="text-xl font-bold font-orbitron">Live Preview</h2>
                    </div>
                    <div ref={previewRef} className="flex-grow w-full h-full">
                        <LivePreview className="!w-full !h-full" />
                    </div>
                    <LiveError className="absolute bottom-0 left-0 right-0 p-3 bg-red-800 text-white font-mono text-sm z-50" />
                </div>
            </div>
        </LiveProvider>
    );
});

export default EditorComponent;
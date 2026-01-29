import React from 'react';
import { Scale, Info } from 'lucide-react';

interface WhiteboardData {
    template: string;
    params: Record<string, any>;
    explanation?: string;
}

const BalanceScale = ({ left, right }: { left: string; right: string }) => (
    <div className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex justify-center items-end gap-8 mb-2 h-24">
            {/* Left Pan */}
            <div className="flex flex-col items-center gap-2 animate-bounce-slow" style={{ animationDuration: '3s' }}>
                <div className="bg-indigo-100 border-2 border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-bold shadow-sm min-w-[60px] text-center">
                    {left}
                </div>
                <div className="w-16 h-1 bg-indigo-300 rounded-full"></div>
                <div className="w-0.5 h-8 bg-indigo-300"></div>
            </div>
            
            {/* Center Pivot */}
            <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-slate-400 mb-8"></div>
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-slate-400"></div>
            </div>

            {/* Right Pan */}
            <div className="flex flex-col items-center gap-2 animate-bounce-slow" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>
                <div className="bg-indigo-100 border-2 border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-bold shadow-sm min-w-[60px] text-center">
                    {right}
                </div>
                <div className="w-16 h-1 bg-indigo-300 rounded-full"></div>
                <div className="w-0.5 h-8 bg-indigo-300"></div>
            </div>
        </div>
        <div className="h-1 bg-slate-300 w-full rounded-full mt-[-2px]"></div>
        <p className="text-center text-xs text-slate-500 mt-2 font-medium">Balance Équilibrée</p>
    </div>
);

const WhiteboardBlock = ({ data }: { data: WhiteboardData }) => {
    return (
        <div className="my-3 border border-indigo-100 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="bg-indigo-50 px-3 py-2 border-b border-indigo-100 flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Tableau Blanc Interactif
                </span>
            </div>
            
            <div className="p-3">
                {data.explanation && (
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 mb-3 flex gap-2 items-start">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <span>{data.explanation}</span>
                    </div>
                )}

                {data.template === 'BALANCE' && (
                    <BalanceScale 
                        left={data.params.left || '?'} 
                        right={data.params.right || '?'} 
                    />
                )}
                
                {data.template !== 'BALANCE' && (
                    <div className="text-xs text-slate-400 p-2 text-center border-2 border-dashed rounded-lg">
                        Visualisation non supportée: {data.template}
                    </div>
                )}
            </div>
        </div>
    );
};

export const FormattedMessage = ({ content }: { content: string }) => {
    // Regex to capture :::WHITEBOARD { ... } :::
    // We use a non-greedy capture for the content inside
    const whiteboardRegex = /:::WHITEBOARD\s*({[\s\S]*?})\s*:::/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = whiteboardRegex.exec(content)) !== null) {
        // Text before the match
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: content.slice(lastIndex, match.index)
            });
        }

        // The match itself
        try {
            const jsonData = JSON.parse(match[1]);
            parts.push({
                type: 'whiteboard',
                data: jsonData
            });
        } catch (e) {
            console.error("Failed to parse whiteboard JSON", e);
            parts.push({
                type: 'text',
                content: match[0] // Fallback to raw text if parse fails
            });
        }

        lastIndex = whiteboardRegex.lastIndex;
    }

    // Remaining text
    if (lastIndex < content.length) {
        parts.push({
            type: 'text',
            content: content.slice(lastIndex)
        });
    }

    return (
        <div className="space-y-1">
            {parts.map((part, i) => (
                <React.Fragment key={i}>
                    {part.type === 'text' && (
                        <p className="whitespace-pre-wrap">{part.content}</p>
                    )}
                    {part.type === 'whiteboard' && (
                        <WhiteboardBlock data={part.data as WhiteboardData} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

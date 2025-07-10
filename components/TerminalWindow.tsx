import React, { useState, useEffect, useRef } from 'react';
import { TerminalIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface Line {
    text: string;
    type: 'output' | 'command' | 'system';
}

const processCommand = async (
    command: string,
    onNewLine: (line: Line) => void
) => {
    onNewLine({ text: `C:\\Users\\User>${command}`, type: 'command' });
    const parts = command.toLowerCase().trim().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    switch (cmd) {
        case 'ping':
            if (args[0]) {
                onNewLine({ text: `Pinging ${args[0]} with 32 bytes of data:`, type: 'output' });
                for (let i = 0; i < 4; i++) {
                    await sleep(700);
                    const time = Math.floor(Math.random() * 20) + 10;
                    const ttl = 128 - Math.floor(Math.random() * 5);
                    onNewLine({ text: `Reply from ${args[0]}: bytes=32 time=${time}ms TTL=${ttl}`, type: 'output' });
                }
            } else {
                onNewLine({ text: "Ping request could not find host. Please check the name and try again.", type: 'output' });
            }
            break;
        case 'ipconfig':
            await sleep(100);
            onNewLine({ text: 'Windows IP Configuration', type: 'output' });
            await sleep(50);
            onNewLine({ text: 'Wireless LAN adapter Wi-Fi:', type: 'output' });
            onNewLine({ text: `   IPv4 Address. . . . . . . . . . . : 192.168.1.10${Math.floor(Math.random() * 9)}`, type: 'output' });
            onNewLine({ text: '   Subnet Mask . . . . . . . . . . . : 255.255.255.0', type: 'output' });
            onNewLine({ text: '   Default Gateway . . . . . . . . . : 192.168.1.1', type: 'output' });
            break;
        case 'help':
            onNewLine({ text: 'Available commands:', type: 'output' });
            onNewLine({ text: '  ping <host>   - Send ICMP ECHO_REQUEST packets to network hosts.', type: 'output' });
            onNewLine({ text: '  ipconfig      - Display current TCP/IP network configuration values.', type: 'output' });
            onNewLine({ text: '  cls           - Clear the screen.', type: 'output' });
            onNewLine({ text: '  help          - Shows this help message.', type: 'output' });
            onNewLine({ text: '  exit          - Closes the terminal window.', type: 'output' });
            break;
        case '': break;
        default:
            onNewLine({ text: `'${cmd}' is not recognized as an internal or external command.`, type: 'output' });
            break;
    }
};

const TerminalWindow: React.FC = () => {
    const { closeWindow } = useAppContext();
    const windowRef = useRef<HTMLDivElement>(null);
    useFocusTrap(windowRef);
    
    const [lines, setLines] = useState<Line[]>([
        { text: 'Windows Terminal [Version 10.0.22621.1]', type: 'system' },
        { text: '(c) Microsoft Corporation. All rights reserved.', type: 'system' },
        { text: '', type: 'system' }
    ]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const endOfLinesRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        endOfLinesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    const addLine = (line: Line) => {
        setLines(prev => [...prev, line]);
    };

    const handleCommandSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const command = input.trim();
        setInput('');

        if (!command) {
            setLines(prev => [...prev, {text: `C:\\Users\\User>`, type: 'command'}]);
            return;
        }

        setIsProcessing(true);
        
        if (command.toLowerCase() === 'cls') {
            setLines([]);
        } else if (command.toLowerCase() === 'exit') {
            closeWindow('terminal');
            return;
        } else {
            await processCommand(command, addLine);
        }
        
        setIsProcessing(false);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    return (
        <div role="dialog" aria-modal="true" aria-labelledby="terminal-title" className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in z-40">
            <div ref={windowRef} className="w-full max-w-3xl h-[60vh] bg-black/80 rounded-lg shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/20" onClick={() => inputRef.current?.focus()}>
                <div className="bg-gray-800 px-4 py-2 flex justify-between items-center cursor-move">
                    <div className="flex items-center space-x-2">
                        <TerminalIcon className="w-4 h-4 text-gray-300" />
                        <span id="terminal-title" className="text-sm font-semibold text-gray-200">Terminal</span>
                    </div>
                    <button onClick={() => closeWindow('terminal')} aria-label="Închide Terminal" className="p-1 rounded-full hover:bg-red-500 hover:text-white transition-colors text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 p-2 font-mono text-sm overflow-y-auto" >
                    {lines.map((line, index) => (
                        <div key={index} className={line.type === 'command' ? 'text-gray-300' : 'text-white whitespace-pre-wrap'}>
                            {line.text}
                        </div>
                    ))}
                    {!isProcessing && (
                        <form onSubmit={handleCommandSubmit} className="flex items-center">
                            <span className="text-gray-300">C:\Users\User&gt;</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 bg-transparent border-none text-white focus:outline-none pl-2"
                                autoFocus
                                autoComplete="off"
                            />
                        </form>
                    )}
                    <div ref={endOfLinesRef} />
                </div>
            </div>
        </div>
    );
};

export default React.memo(TerminalWindow);
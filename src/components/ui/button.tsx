interface ButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
}

export function Button({ text, onClick, className = "" }: ButtonProps) {
    return (
        <button onClick={onClick} className={`p-2 bg-blue-500 text-white rounded ${className}`}>
            {text}
        </button>
    );
}

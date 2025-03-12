interface InputProps {
    placeholder: string;
    value: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export function Input({ placeholder, value, onChange, className = "" }: InputProps) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`p-2 border rounded bg-gray-700 text-white w-full ${className}`}
        />
    );
}
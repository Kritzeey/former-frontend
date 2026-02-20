interface Props {
  placeholder: string;
  name: string;
}

export default function Input({ placeholder, name }: Props) {
  return (
    <input 
      type="text"
      name={name}
      placeholder={placeholder}
      className="duration-200 border-2 border-gray-200 rounded-3xl px-4 py-2 w-full focus:outline-none focus:border-2 focus:border-[#86CEFA]"
    />
  );
}

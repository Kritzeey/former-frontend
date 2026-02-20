interface Props {
  title: string
}

export default function FormCard({ title }: Props) {
  return (
    <div className="max-w-2xl w-full mx-auto bg-white py-2 px-4 rounded-xl text-2xl font-medium text-[#86CEFA]">
      {title}
    </div>
  )
}
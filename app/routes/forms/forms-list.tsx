import FormCard from "~/components/form-card"

let forms = [
  {
    title: "Event Registration Form"
  }, {
    title: "Customer Satisfaction Survey"
  }, {
    title: "Short Quiz"
  }, {
    title: "Volunteer Sign-Up"
  }, {
    title: "Quick Review Session"
  }
]

export default function FormsList() {
  return (
    <main className="h-screen w-full flex flex-col gap-4">
      <span className="font-bold w-full mt-8 text-4xl text-center">Forms List</span>
      <div className="flex flex-col gap-4">
        {forms.map((form) => <FormCard title={form.title}/> )}
      </div>
    </main>
  )
}

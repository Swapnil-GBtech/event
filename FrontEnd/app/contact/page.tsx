import ContactForm from "@/components/contact/ContactForm"
import ContactInfo from "@/components/contact/ContactInfo"

export const metadata = {
  title: "Contact Us | EventHub",
  description: "Get in touch with our team for any inquiries or support",
}

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? Our team is here to help. Fill out the form below and we'll get back to
            you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
          <div>
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  )
}

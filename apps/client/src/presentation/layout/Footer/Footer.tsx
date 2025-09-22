"use client"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <Image
                src="/Grota_logo_horizontal_positivo-removebg-preview.png"
                alt="Grota Financiamentos"
                width={180}
                height={60}
                className="mb-4"
              />
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
            
            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4">Lorem Ipsum</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  <Youtube className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-6 text-orange-500">Lorem</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Lorem Ipsum Dolor
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Sit Amet Consectetur
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Adipiscing Elit
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Sed Do Eiusmod
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Tempor Incididunt
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-6 text-orange-500">Ipsum</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Lorem Ipsum
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dolor Sit
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Amet Consectetur
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Adipiscing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Elit Sed
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-orange-500">Dolor</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-600 text-sm">
                    Lorem Ipsum, 123<br />
                    Dolor - Sit Amet/SP<br />
                    CEP: 12345-678
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <p className="text-gray-600 text-sm">(11) 1234-5678</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <p className="text-gray-600 text-sm">lorem@ipsum.com.br</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-600 text-sm">
                    Lorem - Ipsum: 8h às 18h<br />
                    Dolor: 8h às 12h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              © 2024 Lorem Ipsum. Dolor sit amet consectetur.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Lorem Ipsum
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dolor Sit
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Amet Consectetur
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
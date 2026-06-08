import type { ReactElement } from 'react';
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export async function SiteFooter(): Promise<ReactElement> {
  return (
    <footer className="relative bg-slate-950 text-white border-t border-white/10">

      {/* glow background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16">

        {/* NEWSLETTER */}
        <div className="mb-14">
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-10">

            <div className="grid md:grid-cols-2 gap-8 items-center">

              <div>
                <h3 className="text-3xl font-bold">
                  Subscribe to our newsletter
                </h3>
                <p className="text-blue-200 mt-2">
                  Get investment insights, market updates & exclusive offers.
                </p>
              </div>

              <form className="flex flex-col sm:flex-row gap-3">

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:opacity-90 transition flex items-center justify-center gap-2">
                  Subscribe <ArrowRight className="w-4 h-4" />
                </button>

              </form>

            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* BRAND */}
          <div>
            <h4 className="text-2xl font-bold mb-4">{APP_NAME}</h4>
            <p className="text-blue-200 mb-5 leading-relaxed">
              Smart investment platform designed to help you grow wealth securely and consistently.
            </p>

            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-blue-200" />
                </div>
              ))}
            </div>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>

             <div className="space-y-3 text-blue-200">
              <Link className="hover:text-white transition block" href="/">
                Home
              </Link>
              <Link className="hover:text-white transition block" href="/plans">
                Plans
              </Link>
              <Link className="hover:text-white transition block" href="/login">
                Login
              </Link>
              <Link className="hover:text-white transition block" href="/signup">
                Sign Up
              </Link>
            </div>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>

            <div className="space-y-3 text-blue-200">

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                +91 1800-123-4567
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                support@investpro.com
              </div>

              <Link className="hover:text-white transition block" href="/contact">
                Contact Us
              </Link>

              <Link className="hover:text-white transition block" href="/faq">
                FAQ
              </Link>

            </div>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>

            <div className="space-y-3 text-blue-200">
              <Link className="hover:text-white transition block" href="/privacy">
                Privacy Policy
              </Link>
              <Link className="hover:text-white transition block" href="/terms">
                Terms of Service
              </Link>
              <Link className="hover:text-white transition block" href="/disclaimer">
                Disclaimer
              </Link>
              <Link className="hover:text-white transition block" href="/compliance">
                Compliance
              </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-blue-200">

          <p>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>Bengaluru, India</span>
          </div>

        </div>

        {/* DISCLAIMER */}
        <div className="mt-8 text-xs text-blue-300 leading-relaxed border-t border-white/10 pt-6">
          <p>
            <strong className="text-white">Disclaimer:</strong>{" "}
            This platform is for informational purposes only. Investment involves risk.
            Please consult a financial advisor before investing.
          </p>
        </div>

      </div>
    </footer>
  );
}
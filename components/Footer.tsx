import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-neutral-950 border-t border-amber-500/20 pt-16 pb-8 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold">
                            Kudla<span className="text-gold">Homes.com</span>
                        </h2>
                        <p className="text-neutral-400 leading-relaxed">
                            Your Gateway to Coastal Luxury. Premium real estate consultants in Mangalore specializing in high-end residential and commercial investments.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-gold hover:text-dark-bg transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-gold hover:text-dark-bg transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-gold hover:text-dark-bg transition-colors">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-gold hover:text-dark-bg transition-colors">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-gold">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/" className="text-neutral-400 hover:text-white transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/projects" className="text-neutral-400 hover:text-white transition-colors">New Projects</Link>
                            </li>
                            <li>
                                <Link href="/resale" className="text-neutral-400 hover:text-white transition-colors">Resale Properties</Link>
                            </li>
                            <li>
                                <Link href="/commercial" className="text-neutral-400 hover:text-white transition-colors">Commercial</Link>
                            </li>
                            <li>
                                <Link href="/sell" className="text-neutral-400 hover:text-white transition-colors">Sell Property</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-gold">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-neutral-400">
                                <MapPin size={20} className="text-gold shrink-0 mt-1" />
                                <span>Empire Mall, MG Road,<br />Mangalore, Karnataka 575003</span>
                            </li>
                            <li className="flex items-center gap-3 text-neutral-400">
                                <Phone size={20} className="text-gold shrink-0" />
                                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
                            </li>
                            <li className="flex items-center gap-3 text-neutral-400">
                                <Mail size={20} className="text-gold shrink-0" />
                                <a href="mailto:hello@kudlahomes.com" className="hover:text-white transition-colors">hello@kudlahomes.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal / RERA */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-gold">Legal Disclaimer</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Disclaimer: The content is for information purposes only and does not constitute an offer to avail of any service. Prices mentioned are subject to change without notice and properties are subject to availability. Images for representation purposes only.
                        </p>
                        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/5">
                            <p className="text-xs text-neutral-400">RERA Registration No:</p>
                            <p className="font-mono text-gold">PRM/KA/RERA/1257/334/AG/171114/000000</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
                    <p>Copyright © 2025 KudlaHomes.com. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { TableOfContents } from "@/components/table-of-contents";

export default function PolicyPage() {
    const navigate = useNavigate();

    return (
        <div className="bg-muted flex min-h-svh flex-col items-start justify-start p-6 md:p-10">
            <div className="flex w-full gap-8">
                {/* Table of Contents */}
                <div className="flex-shrink-0">
                    <TableOfContents contentSelector=".policy-content" />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Link to="/login" className="flex items-center gap-2 font-medium">
                            <img src="../logo/logo.png" alt="Logo" className="h-8" />
                        </Link>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-secondary hover:underline"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                    </div>                    {/* Content Card */}
                    <div className="bg-card rounded-lg border border-border shadow-lg p-8 text-white">
                        <h1 className="text-3xl font-bold text-primary mb-6">Privacy Policy</h1>

                        <div className="prose prose-invert max-w-none space-y-6 text-popover-foreground policy-content">
                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">1. Introduction</h2>
                                <p>
                                    PMS Dashboard ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise process your personal information in connection with our website, applications, and services (collectively, the "Service").
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">2. Information We Collect</h2>
                                <p>
                                    We may collect information about you in various ways, including:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Account Registration:</strong> When you create an account, we collect your name, email address, and password.</li>
                                    <li><strong>Profile Information:</strong> Additional information you provide in your user profile.</li>
                                    <li><strong>Usage Data:</strong> Information about how you interact with our Service, including pages visited, features used, and time spent.</li>
                                    <li><strong>Device Information:</strong> Technical information about your device, including IP address, browser type, and operating system.</li>
                                    <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">3. How We Use Your Information</h2>
                                <p>
                                    We use the information we collect for various purposes, including:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Providing, maintaining, and improving our Service</li>
                                    <li>Processing your transactions and sending related information</li>
                                    <li>Sending you technical notices and support messages</li>
                                    <li>Responding to your comments and questions</li>
                                    <li>Personalizing your experience on our Service</li>
                                    <li>Conducting analytics and research to improve our Service</li>
                                    <li>Detecting and preventing fraud and abuse</li>
                                    <li>Complying with legal obligations</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">4. Information Sharing</h2>
                                <p>
                                    We do not sell, trade, or rent your personal information to third parties. However, we may share information in the following circumstances:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>With service providers who assist us in operating our Service</li>
                                    <li>When required by law or legal process</li>
                                    <li>To protect our rights, privacy, safety, or property</li>
                                    <li>With your consent or at your direction</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">5. Data Security</h2>
                                <p>
                                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">6. Your Rights</h2>
                                <p>
                                    Depending on your location, you may have certain rights regarding your personal information, including:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>The right to access your personal information</li>
                                    <li>The right to correct or update your information</li>
                                    <li>The right to request deletion of your information</li>
                                    <li>The right to object to processing of your information</li>
                                    <li>The right to data portability</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">7. Cookies</h2>
                                <p>
                                    Our Service uses cookies to enhance user experience. You can control cookie settings through your browser preferences. Disabling cookies may affect the functionality of our Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">8. Children's Privacy</h2>
                                <p>
                                    Our Service is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that a child has provided us with personal information, we will take steps to delete such information.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">9. Changes to This Policy</h2>
                                <p>
                                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on the Service and updating the "Last Updated" date.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">10. Contact Us</h2>
                                <p>
                                    If you have questions about this Privacy Policy or our privacy practices, please contact us at privacy@pmsdashboard.com.
                                </p>
                            </section>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-xs text-gray-500">
                        <p>&copy; 2025 PMS Dashboard. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

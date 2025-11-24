import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { TableOfContents } from "@/components/table-of-contents";

export default function TermsPage() {
    const navigate = useNavigate();

    return (
        <div className="bg-muted flex min-h-svh flex-col items-start justify-start p-6 md:p-10">
            <div className="flex w-full gap-8">
                {/* Table of Contents */}
                <div className="flex-shrink-0">
                    <TableOfContents contentSelector=".terms-content" />
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
                    </div>

                    {/* Content Card */}
                    <div className="bg-card rounded-lg border border-border shadow-lg p-8 text-white">
                        <h1 className="text-3xl font-bold text-primary mb-6">Terms of Service</h1>

                        <div className="prose prose-invert max-w-none space-y-6 text-popover-foreground terms-content">
                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">1. Introduction</h2>
                                <p>
                                    Welcome to PMS Dashboard ("we," "us," "our," or "Company"). These Terms of Service ("Terms") govern your access to and use of our website, application, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to any part of these Terms, you may not use the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">2. Use License</h2>
                                <p>
                                    Permission is granted to temporarily download one copy of the materials (information or software) on PMS Dashboard for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Modify or copy the materials</li>
                                    <li>Use the materials for any commercial purpose or for any public display</li>
                                    <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
                                    <li>Remove any copyright or other proprietary notations from the materials</li>
                                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">3. Disclaimer</h2>
                                <p>
                                    The materials on PMS Dashboard are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">4. Limitations</h2>
                                <p>
                                    In no event shall PMS Dashboard or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PMS Dashboard, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">5. Accuracy of Materials</h2>
                                <p>
                                    The materials appearing on PMS Dashboard could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the Service are accurate, complete, or current. We may make changes to the materials contained on the Service at any time without notice.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">6. Links</h2>
                                <p>
                                    We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">7. Modifications</h2>
                                <p>
                                    We may revise these Terms of Service for the Service at any time without notice. By using the Service, you are agreeing to be bound by the then current version of these Terms of Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">8. Governing Law</h2>
                                <p>
                                    These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which the Company is located, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-primary mb-3">9. Contact Us</h2>
                                <p>
                                    If you have any questions about these Terms, please contact us at support@pmsdashboard.com.
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

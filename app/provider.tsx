import { ThemeProvider } from '@/components/theme-provider';
import React from 'react'
import SiteNavbar from './_component/Navbar';
import SiteFooter from './_component/Footer';

function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <SiteNavbar/>
                {children}
                <SiteFooter/>
            </ThemeProvider>
        </div>
    )
}

export default Provider
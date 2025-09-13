import { Poppins } from "next/font/google";
import "./globals.css";
import { WeekendProvider } from "@/context/WeekendContext";
import DragDropProvider from "@/components/DragDropProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
  preload: true,
});

export const metadata = {
  title: "Weekendly - Your Perfect Weekend Planner",
  description: "Design your ideal Saturday-Sunday schedule with Weekendly. Browse activities, create timelines, and track your weekend vibes.",
  keywords: "weekend planner, schedule, activities, timeline, mood tracking",
  authors: [{ name: "Weekendly Team" }],
};
export const viewport = "width=device-width, initial-scale=1"; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <WeekendProvider>
          <DragDropProvider>
            {children}
          </DragDropProvider>
        </WeekendProvider>
      </body>
    </html>
  );
}

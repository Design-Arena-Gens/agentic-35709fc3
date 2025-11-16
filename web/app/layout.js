export const metadata = {
  title: "PDF to Study Notes",
  description: "Turn PDFs into point-wise notes for better studying",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}

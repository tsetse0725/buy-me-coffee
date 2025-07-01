export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/2 h-full bg-[#FFDD00] flex flex-col items-center justify-center text-center px-8 relative">
        <div className="absolute top-6 left-6 text-black font-semibold text-lg">
          <span className="inline-block mr-1"></span>
          <img src="/Logo.png" alt="/" />
        </div>

        <img
          src="/illustration.png"
          alt="Coffee cup"
          className="w-40 h-40 mb-8"
        />

        <h2 className="text-xl font-bold text-black mb-2">
          Fund your creative work
        </h2>
        <p className="text-black text-sm max-w-xs">
          Accept support. Start a membership. Setup a shop. It’s easier than you
          think.
        </p>
      </div>

      <div className="w-1/2 h-full bg-white flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

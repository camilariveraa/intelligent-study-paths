import logo from "@/assets/next-logo.png";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <img 
          src={logo} 
          alt="Next Logo" 
          className="w-10 h-10 drop-shadow-[0_0_20px_rgba(190,82,216,0.5)]"
        />
      </div>
      <span className="text-2xl font-bold tracking-tight">next</span>
    </div>
  );
};

export default Logo;

import { APP } from "@/utils";

const Splash = ({message='Loading...'}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      
      <div className="flex flex-col items-center">
        
        {/* Logo */}
        <img
          src={import.meta.env.VITE_APP_LOGO_URL}
          alt={APP.name}
          className="w-24 ml-4  h-auto mb-6 animate-fade-in"
        />

        {/* Loader */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        </div>

        {/* Optional subtle text */}
        <p className="text-xs text-gray-400 mt-4">
          {message}
        </p>

      </div>
    </div>
  );
};

export  {Splash};
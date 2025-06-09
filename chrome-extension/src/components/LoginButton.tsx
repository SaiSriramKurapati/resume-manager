export default function LoginButton() {
  
  const handleLogin = () => {
    window.open('https://www.resumemanager.app/login', '_blank');
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
    >
      Login 
    </button>
  );
} 
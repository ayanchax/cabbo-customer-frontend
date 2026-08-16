import { useCustomer } from "@/hooks";

 

const HomeHeader = () => {
  const { firstName } = useCustomer();

  return (
  <div className="px-4 pt-8 pb-4 max-w-2xl mx-auto">
  <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
    Hello, {firstName} <span className="ml-1">👋</span>
  </h1>

  <div className="mt-4 h-px bg-gray-100" />
</div>
  );
};

export default HomeHeader;

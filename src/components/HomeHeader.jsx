import { useCustomer } from "@/hooks";

const getFirstName = (name) => {
  if (!name) return "there";
  return name.trim().split(" ")[0];
};

const HomeHeader = () => {
  const { customer } = useCustomer();
  const firstName = getFirstName(customer?.name);

  return (
    <div className="px-4 pt-8 pb-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
        Hello, {firstName} <span className="ml-1">👋</span>
      </h1>

      <p className="text-base text-gray-500 mt-1">
        Where do you want to go?
      </p>

      <div className="mt-4 h-px bg-gray-100" />
    </div>
  );
};

export default HomeHeader;
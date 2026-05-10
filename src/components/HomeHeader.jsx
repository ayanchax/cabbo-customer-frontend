import { useCustomer } from "@/hooks";

const getFirstName = (name) => {
  if (!name) return "there";
  let nameParts = name.trim().split(" ");
  if (nameParts.length === 0) return "there";
  if(nameParts.length>2){ //Name has more than 2 parts, we can assume it's something like "John Doe Smith" and we want to show "John D."
    // Handle cases like "John Doe Smith" → "John D."
    return `${nameParts[0]} ${nameParts[1][0]}.`;
  }
  return nameParts[0];
};

const HomeHeader = () => {
  const { customer } = useCustomer();
  const firstName = getFirstName(customer?.name);

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
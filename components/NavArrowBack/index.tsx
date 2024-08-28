import { useRouter } from "next/router";

const NavArrow = () => {
  const router = useRouter();

  return (
    <div className="relative -left-8">
      {router.asPath != "/" && (
        <div className="py-6">
          <button
            className="flex items-center p-2 border rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
            aria-haspopup="true"
            title="Show Cities"
            onClick={() => router.back()}
          >
            <svg
              className="w-4 h-4 transform rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
            <span>Back</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NavArrow;

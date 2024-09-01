import {
  ArrowUpIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowNarrowUpIcon,
} from "@heroicons/react/outline";

export const getWindDirectionArrow = (direction: string) => {
  const directions: { [key: string]: JSX.Element } = {
    N: <ArrowUpIcon className="w-5 h-5 transform rotate-0" />,
    NNE: <ArrowNarrowUpIcon className="w-5 h-5 transform rotate-[22.5deg]" />,
    NE: <ArrowNarrowUpIcon className="w-5 h-5 transform rotate-45" />,
    ENE: <ArrowNarrowUpIcon className="w-5 h-5 transform rotate-[67.5deg]" />,
    E: <ArrowRightIcon className="w-5 h-5 transform rotate-0" />,
    ESE: <ArrowNarrowUpIcon className="w-5 h-5 transform rotate-[112.5deg]" />,
    SE: <ArrowNarrowUpIcon className="w-5 h-5 transform rotate-135" />,
    SSE: <ArrowNarrowUpIcon className="w-5 h-5 transform rotate-[157.5deg]" />,
    S: <ArrowDownIcon className="w-5 h-5 transform rotate-0" />,
    SSW: <ArrowNarrowUpIcon className="w-5 h-5 transform rotate-[202.5deg]" />,
    SW: <ArrowNarrowUpIcon className="w-5 h-5 transform rotate-225" />,
    WSW: <ArrowNarrowUpIcon className="w-5 h-5 transform rotate-[247.5deg]" />,
    W: <ArrowLeftIcon className="w-5 h-5 transform rotate-0" />,
    WNW: <ArrowNarrowUpIcon className="w-5 h-5 transform rotate-[292.5deg]" />,
    NW: <ArrowNarrowUpIcon className="w-5 h-5 transform rotate-315" />,
    NNW: <ArrowNarrowUpIcon className="w-5 h-5 transform rotate-[337.5deg]" />,
  };

  return directions[direction] || <ArrowRightIcon />;
};

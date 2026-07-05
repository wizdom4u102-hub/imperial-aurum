"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

type Props = {
  end: number;
  suffix?: string;
  prefix?: string;
};

export default function StatsCounter({
  end,
 suffix = "",
  prefix = "",
}: Props) {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  return (
    <span ref={ref}>
      {inView ? (
        <CountUp
          start={0}
          end={end}
          duration={3}
          separator=","
          prefix={prefix}
          suffix={suffix}
        />
      ) : (
        "0"
      )}
    </span>
  );
}
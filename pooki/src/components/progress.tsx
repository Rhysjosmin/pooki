import { motion } from "framer-motion";

export function ProgressBar({
  stat,
}: {
  stat: { stat: { name: string }; base_stat: string };
}) {
  return (
    <div className="flex flex-col">
      <h4 className="text-white capitalize">{stat["stat"]["name"]}</h4>
      <div className="w-96 h-[5px]  bg-neutral-900  rounded-full overflow-hidden">
        <motion.div
          className="bg-white h-full transition-all"
          initial={{ width: 0 }}
          animate={{
            width: (Number.parseFloat(stat["base_stat"]) / 255) * 100 + "%",
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

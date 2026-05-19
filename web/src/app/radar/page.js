import TrendRadar from "../components/TrendRadar";

export const metadata = {
  title: "Trend Radar",
};

export default function RadarPage() {
  return (
    <div className="flex flex-col h-full">
      <TrendRadar />
    </div>
  );
}

import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import JobBoard from "@/components/JobBoard";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-v-dark-gray-cyan/10 transition-colors duration-300">
      <Header />
      <FilterBar />
      <JobBoard />
    </div>
  );
}

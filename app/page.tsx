import Calendar from './components/Calendar'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-8 pb-24">
        <header className="text-center mb-12 px-4">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Workout Tracker</h1>
          <p className="text-sm text-gray-500">Track your daily progress</p>
        </header>
        <Calendar />
      </div>
    </div>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SubjectSetupPage from "./pages/SubjectSetupPage";
import TopicEditorPage from "./pages/TopicEditorPage";
import PlanConfigPage from "./pages/PlanConfigPage";
import DailyPlanPage from "./pages/DailyPlanPage";
import ProgressPage from "./pages/ProgressPage";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/subject/:id/setup" element={<SubjectSetupPage />} />
                <Route path="/subject/:id/topics" element={<TopicEditorPage />} />
                <Route path="/subject/:id/plan-config" element={<PlanConfigPage />} />
                <Route path="/subject/:id/daily" element={<DailyPlanPage />} />
                <Route path="/subject/:id/progress" element={<ProgressPage />} />
            </Routes>
        </BrowserRouter>
    );
}

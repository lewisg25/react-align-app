import { motion as Motion, useReducedMotion } from "framer-motion";
import ReflectionScreen from "./ReflectionScreen";
import {
  DashboardTopbar,
  QuestionPanel,
  QuestionPicker,
  ResponseHistoryPanel,
  StreakStrip,
  WeeklySummary,
} from "./DashboardSections";
import { useDashboard } from "./useDashboard";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const Dashboard = () => {
  const dashboard = useDashboard();
  const prefersReducedMotion = useReducedMotion();

  return (
    <Motion.main
      className="dashboard-shell"
      variants={stagger}
      initial={prefersReducedMotion ? false : "hidden"}
      animate="show"
    >
      <Motion.div variants={reveal}>
        <DashboardTopbar
          coupleNames={dashboard.coupleNames}
          firstName={dashboard.firstName}
          localDateTime={dashboard.localDateTime}
          marriageYearsLabel={dashboard.marriageYearsLabel}
          onLogout={dashboard.handleLogout}
        />
      </Motion.div>
      <Motion.div variants={reveal}>
        <StreakStrip
          answeredToday={dashboard.questionPanel.answeredToday}
          responseHistory={dashboard.responseHistory}
          streak={dashboard.streak}
          todayIdentifier={dashboard.todayIdentifier}
        />
      </Motion.div>
      {dashboard.error && (
        <Motion.p className="error-message" variants={reveal}>
          {dashboard.error}
        </Motion.p>
      )}

      <Motion.section className="dashboard-content" variants={reveal}>
        <QuestionPanel {...dashboard.questionPanel} />
        <QuestionPicker {...dashboard.questionPicker} />
        <ResponseHistoryPanel {...dashboard.responseHistoryPanel} />
        <ReflectionScreen
          coupleNames={dashboard.coupleNames}
          key={dashboard.reflectionKey}
          question={dashboard.selectedQuestion}
          editableResponse={dashboard.editableResponse}
          onSave={dashboard.handleSaveResponse}
          onUpdate={dashboard.handleUpdateResponse}
          onDelete={dashboard.handleDeleteResponse}
          isLocked={dashboard.isResponseLocked}
          lockedMessage={dashboard.lockedMessage}
        />
        <WeeklySummary summary={dashboard.summary} />
      </Motion.section>
    </Motion.main>
  );
};

export default Dashboard;

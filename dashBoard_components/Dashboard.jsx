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

const Dashboard = () => {
  const dashboard = useDashboard();

  return (
    <main className="dashboard-shell">
      <DashboardTopbar
        firstName={dashboard.firstName}
        localDateTime={dashboard.localDateTime}
        onLogout={dashboard.handleLogout}
      />
      <StreakStrip streak={dashboard.streak} />
      {dashboard.error && <p className="error-message">{dashboard.error}</p>}

      <section className="dashboard-content">
        <QuestionPanel {...dashboard.questionPanel} />
        <QuestionPicker {...dashboard.questionPicker} />
        <ResponseHistoryPanel {...dashboard.responseHistoryPanel} />
        <ReflectionScreen
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
      </section>
    </main>
  );
};

export default Dashboard;

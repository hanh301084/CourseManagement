
// AppRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import Login from "../page/Login/Login.jsx";
import UserList from "../page/headOfDepartment/userManagement/UserList.jsx";
import RoleList from "../page/headOfDepartment/roleManagement/RoleList.jsx";
import SemesterList from "../page/headOfDepartment/semesterManagement/SemesterList.jsx";
import OAuth2RedirectHandler from "../oauth2/OAuth2RedirectHandler";
import Page404 from "../page/ErrorPage/404Page.jsx";
import Profile from "../page/Profile/profile.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import HodDashboardPage from "../page/headOfDepartment/Dashboard.jsx";
import StudentDashboard from "../page/Student/Dashboard.jsx";
import TeacherDashboard from "../page/Teacher/Dashboard.jsx";
import ReviewerDashboard from "../page/Reviewer/Dashboard.jsx";
import ClassList from "../page/headOfDepartment/classManagement/ClassList.jsx";
import IterationList from '../page/headOfDepartment/iterationManagement/IterationList.jsx';
import ProjectList from "../page/Teacher/Project/ProjectList.jsx";
import ProjectDetails from "../page/Teacher/Project/ProjectDetails.jsx";
import FeatureList from "../page/Teacher/Feature/FeatureList.jsx";
import ClassListForTeacher from "../page/Teacher/classManagement/ClassList.jsx";
import ClassUserListForTeacher from "../page/Teacher/classUserManagement/ClassUserList.jsx";
import ClassListForStudent from "../page/Student/ClassList.jsx";
import ClassUserListForStudent from "../page/Student/classUserList.jsx";
import ClassListForReviewer from "../page/Reviewer/ClassList.jsx";
import ClassUserListForReviewer from "../page/Reviewer/classUserList.jsx";
import Project_Backlog from "../page/Teacher/ProjectBacklog/projectBacklog.jsx";
import CheckList from "../page/Teacher/CheckListManagement/CheckLists.jsx";
import Setting from "../page/headOfDepartment/Setting.jsx";
import ProjectList4Student from "../page/Student/Project/ProjectList.jsx";
import Project_Backlog4Student from "../page/Student/ProjectBacklog/projectBacklog.jsx";
import Grade from "../page/Reviewer/Grade.jsx";
import ProjectDetail4Student from "../page/Student/Project/ProjectDetails.jsx";

const ReviewerRouter = [
  { path: "/reviewer/profile", component: Profile },
  { path: "/reviewer/dashboard", component: ReviewerDashboard },
  { path: "/reviewer/class-list", component: ClassListForReviewer },
  { path: "/reviewer/class-user-list/:selectedSemesterId/:classCode/:classId", component: ClassUserListForReviewer },
  { path: "/reviewer/grade/:classCode", component: Grade }
];


const StudentRouter = [
  { path: "/student/profile", component: Profile },
  { path: "/student/dashboard", component: StudentDashboard },
  { path: "/student/class-list", component: ClassListForStudent },
  { path: "/student/class-user-list/:selectedSemester/:classCode/:classId/:currentUserId", component: ClassUserListForStudent },
  { path: "/student/project-list", component: ProjectList4Student },
  { path: "/student/project-backlog", component: Project_Backlog4Student },
  { path: "/student/project-details/:projectId", component: ProjectDetail4Student },
];

const TeacherRouter = [
  { path: "/teacher/home", component: Project_Backlog },
  { path: "/teacher/profile", component: Profile },
  { path: "/teacher/dashboard", component: TeacherDashboard },
  { path: "/teacher/project-list", component: ProjectList },
  { path: "/teacher/project-details/:projectId", component: ProjectDetails },
  { path: "/teacher/feature-list", component: FeatureList },
  { path: "/teacher/class-list", component: ClassListForTeacher },
  { path: "/teacher/class-user-list/:selectedSemesterId/:classCode/:classId", component: ClassUserListForTeacher },
  { path: "/teacher/class-user-list", component: ClassUserListForTeacher },
  { path: "/teacher/class-user-list", component: ClassUserListForTeacher },
  { path: "/teacher/project-backlog", component: Project_Backlog },
  { path: "/teacher/check-list", component: CheckList },
];

const HodRouter = [
  { path: "/profile", component: Profile },
  { path: "/hod/user-list", component: UserList },
  { path: "/hod/role-list", component: RoleList },
  { path: "/hod/semester-list", component: SemesterList },
  { path: "/hod/user-list", component: UserList },
  { path: "/hod/dashboard", component: HodDashboardPage },
  { path: "/hod/class-list", component: ClassList },
  { path: '/hod/iteration-list', component: IterationList },
  { path: '/hod/setting', component: Setting }
];


const AppRoutes = () => {
  const hodRoutes = HodRouter.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <ProtectedRoute
          component={route.component}
          requiredRole="HeadOfDepartment"
        />
      }
    />
  ));

  const studentRouter = StudentRouter.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <ProtectedRoute component={route.component} requiredRole="STUDENT" />
      }
    />
  ));
  const teacherRouter = TeacherRouter.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <ProtectedRoute component={route.component} requiredRole="TEACHER" />
      }
    />
  ));
  const reviewerRouter = ReviewerRouter.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <ProtectedRoute component={route.component} requiredRole="REVIEWER" />
      }
    />
  ));

  return [
    ...hodRoutes,
    ...studentRouter,
    ...teacherRouter,
    ...reviewerRouter,
    <Route
      key="/oauth2/redirect"
      path="/oauth2/redirect"
      element={<OAuth2RedirectHandler />}
    />,
    <Route key="/logout" path="/logout" element={<Login />} />,
    <Route key="*" path="*" element={<Page404 />} />,
    <Route key="/login" path="/login" element={<Login />} />,
    <Route key="" path="" element={<Login />} />,
  ];
};


export default AppRoutes;

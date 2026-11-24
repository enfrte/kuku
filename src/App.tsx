import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ContentUpdateDialog } from './components/content/ContentUpdateDialog'
import { AppLayout } from './components/layout/AppLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { ScrollToTop } from './components/layout/ScrollToTop'
import type { DeployedContentFile } from './db/deployedContentRepo'
import { CoursesPage } from './pages/student/CoursesPage'
import { LessonsPage } from './pages/student/LessonsPage'
import { QuizPage } from './pages/student/QuizPage'
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage'
import { CourseFormPage } from './pages/admin/CourseFormPage'
import { AdminLessonsPage } from './pages/admin/AdminLessonsPage'
import { LessonFormPage } from './pages/admin/LessonFormPage'
import { AdminQuestionsPage } from './pages/admin/AdminQuestionsPage'
import { DataPage } from './pages/admin/DataPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App({
  initialContentUpdate = null,
  localContentVersion = 0,
}: {
  initialContentUpdate?: DeployedContentFile | null
  localContentVersion?: number
}) {
  const [contentUpdate, setContentUpdate] = useState(initialContentUpdate)

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<CoursesPage />} />
          <Route path="courses/:courseId" element={<LessonsPage />} />
          <Route path="lessons/:lessonId" element={<QuizPage />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminCoursesPage />} />
            <Route path="courses/new" element={<CourseFormPage />} />
            <Route path="courses/:courseId/edit" element={<CourseFormPage />} />
            <Route path="courses/:courseId/lessons" element={<AdminLessonsPage />} />
            <Route path="courses/:courseId/lessons/new" element={<LessonFormPage />} />
            <Route path="lessons/:lessonId/edit" element={<LessonFormPage />} />
            <Route path="lessons/:lessonId/questions" element={<AdminQuestionsPage />} />
            <Route path="data" element={<DataPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ContentUpdateDialog
        update={contentUpdate}
        localVersion={localContentVersion}
        onClose={() => setContentUpdate(null)}
      />
    </BrowserRouter>
  )
}

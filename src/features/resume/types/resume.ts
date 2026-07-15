export type ResumeContact = {
  phone: string
  email: string
  github: string
  githubUrl: string
  location: string
}

export type ResumeExperience = {
  company: string
  companyUrl?: string
  period: string
  title: string
  highlights: string[]
}

export type ResumeSkillGroup = {
  label: string
  value: string
}

export type ResumeProject = {
  name: string
  url: string
  period: string
  role: string
  description: string
  technologies: string
  responsibilities: string[]
}

export type ResumeEducation = {
  school: string
  period: string
  degree: string
  highlights: string[]
}

export type Resume = {
  name: string
  title: string
  contact: ResumeContact
  objective: string
  experience: ResumeExperience[]
  skills: ResumeSkillGroup[]
  projects: ResumeProject[]
  education: ResumeEducation[]
}

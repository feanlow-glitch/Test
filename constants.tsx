
import { Question, CategoryKey } from './types';

export const QUESTIONS: Question[] = [
  { id: 1, text: "I like to work on cars", category: 'R' },
  { id: 2, text: "I like to do puzzles", category: 'I' },
  { id: 3, text: "I am good at working independently", category: 'I' },
  { id: 4, text: "I like to work in teams", category: 'S' },
  { id: 5, text: "I am an ambitious person, I set goals for myself", category: 'E' },
  { id: 6, text: "I like to organize things, (files, desks/offices)", category: 'C' },
  { id: 7, text: "I like to build things", category: 'R' },
  { id: 8, text: "I like to read about art and music", category: 'A' },
  { id: 9, text: "I like to have clear instructions to follow", category: 'C' },
  { id: 10, text: "I like to try to influence or persuade people", category: 'E' },
  { id: 11, text: "I like to do experiments", category: 'I' },
  { id: 12, text: "I like to teach or train people", category: 'S' },
  { id: 13, text: "I like trying to help people solve their problems", category: 'S' },
  { id: 14, text: "I like to take care of animals", category: 'R' },
  { id: 15, text: "I wouldn’t mind working 8 hours per day in an office", category: 'C' },
  { id: 16, text: "I like selling things", category: 'E' },
  { id: 17, text: "I enjoy creative writing", category: 'A' },
  { id: 18, text: "I enjoy science", category: 'I' },
  { id: 19, text: "I am quick to take on new responsibilities", category: 'E' },
  { id: 20, text: "I am interested in healing people", category: 'S' },
  { id: 21, text: "I enjoy trying to figure out how things work", category: 'I' },
  { id: 22, text: "I like putting things together or assembling things", category: 'R' },
  { id: 23, text: "I am a creative person", category: 'A' },
  { id: 24, text: "I pay attention to details", category: 'C' },
  { id: 25, text: "I like to do filing or typing", category: 'C' },
  { id: 26, text: "I like to analyze things (problems/situations)", category: 'I' },
  { id: 27, text: "I like to play instruments or sing", category: 'A' },
  { id: 28, text: "I enjoy learning about other cultures", category: 'S' },
  { id: 29, text: "I would like to start my own business", category: 'E' },
  { id: 30, text: "I like to cook", category: 'R' },
  { id: 31, text: "I like acting in plays", category: 'A' },
  { id: 32, text: "I am a practical person", category: 'R' },
  { id: 33, text: "I like working with numbers or charts", category: 'C' },
  { id: 34, text: "I like to get into discussions about issues", category: 'S' },
  { id: 35, text: "I am good at keeping records of my work", category: 'C' },
  { id: 36, text: "I like to lead", category: 'E' },
  { id: 37, text: "I like working outdoors", category: 'R' },
  { id: 38, text: "I would like to work in an office", category: 'C' },
  { id: 39, text: "I'm good at math", category: 'I' },
  { id: 40, text: "I like helping people", category: 'S' },
  { id: 41, text: "I like to draw", category: 'A' },
  { id: 42, text: "I like to give speeches", category: 'E' },
];

export const CATEGORY_DESCRIPTIONS: Record<CategoryKey, { title: string, description: string, color: string }> = {
  R: { 
    title: "Realistic (Doers)", 
    description: "You often have athletic or mechanical ability, prefer to work with objects, machines, tools, plants or animals, or to be outdoors.", 
    color: "#10b981" 
  },
  I: { 
    title: "Investigative (Thinkers)", 
    description: "You like to observe, learn, investigate, analyze, evaluate or solve problems. You value science and precision.", 
    color: "#3b82f6" 
  },
  A: { 
    title: "Artistic (Creators)", 
    description: "You have artistic, innovating or intuitional abilities and like to work in unstructured situations using your imagination and creativity.", 
    color: "#ec4899" 
  },
  S: { 
    title: "Social (Helpers)", 
    description: "You like to work with people to enlighten, inform, help, train, or cure them, or are skilled with words.", 
    color: "#14b8a6" 
  },
  E: { 
    title: "Enterprising (Persuaders)", 
    description: "You like to work with people, influencing, persuading, performing, leading or managing for organizational goals or economic gain.", 
    color: "#f59e0b" 
  },
  C: { 
    title: "Conventional (Organizers)", 
    description: "You like to work with data, have clerical or numerical ability, carry out tasks in detail or follow through on others' instructions.", 
    color: "#64748b" 
  },
};

export const PATHWAYS_BY_CATEGORY: Record<CategoryKey, string[]> = {
  R: ["Natural Resources", "Health Services", "Industrial and Engineering Technology", "Arts and Communication"],
  I: ["Health Services", "Business", "Public and Human Services", "Industrial and Engineering Technology"],
  A: ["Public and Human Services", "Arts and Communication"],
  S: ["Health Services", "Public and Human Services"],
  E: ["Business", "Public and Human Services", "Arts and Communication"],
  C: ["Health Services", "Business", "Industrial and Engineering Technology"]
};

export const CAREER_DATABASE: Record<CategoryKey, string[]> = {
  R: [
    "Aerospace Engineering Technician", "Agricultural Inspector", "Aircraft Mechanic", "Animal Trainer",
    "Automotive Master Mechanic", "Civil Engineer", "Electrician", "Commercial Pilot", "Construction Laborer",
    "Diver", "Dredge Operator", "Electronic Drafter", "Farmworker", "Forest Fire Fighter", "Machinist",
    "Radio Mechanic", "Roustabout", "Sheet Metal Worker", "Surveyor", "Welder"
  ],
  I: [
    "Aerospace Engineer", "Anesthesiologist", "Astronomer", "Biochemist", "Clinical Psychologist",
    "Computer Programmer", "Data Scientist", "Dentist", "Economist", "Environmental Scientist",
    "Geoscientist", "Hydrologist", "Medical Scientist", "Pharmacist", "Physicist", "Software Developer",
    "Veterinarian", "Zoologist", "Mathematician", "Microbiologist"
  ],
  A: [
    "Actor", "Art Director", "Choreographer", "Composer", "Craft Artist", "Dancer", "Editor",
    "Fashion Designer", "Graphic Designer", "Interior Designer", "Landscape Architect", "Photographer",
    "Poet/Lyricist", "Radio/TV Announcer", "Singer", "Technical Writer", "Desktop Publisher",
    "Floral Designer", "Hairdresser", "Interpreter/Translator"
  ],
  S: [
    "Adult Literacy Teacher", "Athletic Trainer", "Child Care Worker", "Counseling Psychologist",
    "Dental Hygienist", "Elementary School Teacher", "Emergency Medical Technician", "Fitness Trainer",
    "High School Teacher", "Librarian", "Nurse", "Occupational Therapist", "Physical Therapist",
    "Physician Assistant", "Social Worker", "Special Education Teacher", "Speech-Language Pathologist",
    "Tour Guide", "Waiter/Waitress", "Educational Counselor"
  ],
  E: [
    "Administrative Services Manager", "Advertising Sales Agent", "Chief Executive", "Construction Manager",
    "Customer Service Representative", "Financial Manager", "Judge", "Lawyer", "Marketing Manager",
    "Personal Financial Advisor", "Public Relations Specialist", "Real Estate Broker", "Sales Manager",
    "Transportation Manager", "Travel Agent", "Purchasing Agent", "Lodging Manager", "Hotel Manager",
    "Flight Attendant", "Entrepreneur"
  ],
  C: [
    "Accountant", "Actuary", "Auditor", "Bill/Account Collector", "Bookkeeping Clerk", "Budget Analyst",
    "Cargo Agent", "Cashier", "Computer Operator", "Cost Estimator", "Data Entry Keyer", "Database Administrator",
    "File Clerk", "Financial Analyst", "Insurance Underwriter", "Legal Secretary", "Loan Officer",
    "Medical Records Technician", "Payroll Clerk", "Pharmacy Aide", "Proofreader", "Teller"
  ]
};

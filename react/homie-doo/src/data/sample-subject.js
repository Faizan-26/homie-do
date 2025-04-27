// Sample subject data with unique IDs for all syllabus elements
export const sampleSubject = {
    id: "sub_1234",
    name: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Jane Smith",
    term: "Fall 2023",
    courseMaterials: {
        syllabus: {
            title: "Course Syllabus",
            content: "This course provides an introduction to computer science and programming concepts.",
            sections: [
                {
                    id: "unit_1",
                    title: "Fundamentals of Programming",
                    weeks: "1-3",
                    chapters: [
                        {
                            id: "chapter_1",
                            title: "Introduction to Programming Languages",
                            subtopics: [
                                {
                                    id: "subtopic_1",
                                    title: "What is a programming language?"
                                },
                                {
                                    id: "subtopic_2",
                                    title: "High-level vs. low-level languages"
                                }
                            ]
                        },
                        {
                            id: "chapter_2",
                            title: "Variables and Data Types",
                            subtopics: [
                                {
                                    id: "subtopic_3",
                                    title: "Primitive data types"
                                },
                                {
                                    id: "subtopic_4",
                                    title: "Variables and constants"
                                }
                            ]
                        }
                    ]
                },
                {
                    id: "unit_2",
                    title: "Control Structures",
                    weeks: "4-6",
                    chapters: [
                        {
                            id: "chapter_3",
                            title: "Conditional Statements",
                            subtopics: [
                                {
                                    id: "subtopic_5",
                                    title: "If statements"
                                },
                                {
                                    id: "subtopic_6",
                                    title: "Switch statements"
                                }
                            ]
                        },
                        {
                            id: "chapter_4",
                            title: "Loops",
                            subtopics: [
                                {
                                    id: "subtopic_7",
                                    title: "For loops"
                                },
                                {
                                    id: "subtopic_8",
                                    title: "While loops"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        lectures: [
            {
                id: "lecture_1",
                title: "Introduction to the Course",
                date: "2023-09-01",
                content: "Overview of the course topics and expectations.",
                files: [
                    { name: "intro-slides.pdf", url: "/files/intro-slides.pdf" }
                ]
            },
            {
                id: "lecture_2",
                title: "Programming Fundamentals",
                date: "2023-09-08",
                content: "Introduction to basic programming concepts and syntax.",
                files: [
                    { name: "fundamentals.pdf", url: "/files/fundamentals.pdf" }
                ]
            }
        ],
        readings: [
            {
                id: "reading_1",
                title: "Introduction to Computer Science",
                author: "John Doe",
                type: "Textbook",
                chapters: "Chapters 1-2",
                source: "Publisher XYZ",
                length: "45 pages",
                files: [
                    { name: "intro-reading.pdf", url: "/files/intro-reading.pdf" }
                ]
            },
            {
                id: "reading_2",
                title: "The Art of Programming",
                author: "Jane Smith",
                type: "Article",
                chapters: "",
                source: "CS Journal",
                length: "15 pages",
                files: [
                    { name: "art-of-programming.pdf", url: "/files/art-of-programming.pdf" }
                ]
            }
        ],
        assignments: [
            {
                id: "assignment_1",
                title: "Hello World Program",
                dueDate: "2023-09-15",
                points: 10,
                instructions: "Create a simple 'Hello World' program in the language of your choice.",
                files: [
                    { name: "assignment1.pdf", url: "/files/assignment1.pdf" }
                ]
            },
            {
                id: "assignment_2",
                title: "Basic Calculator",
                dueDate: "2023-09-30",
                points: 20,
                instructions: "Implement a calculator that can perform basic arithmetic operations.",
                files: [
                    { name: "assignment2.pdf", url: "/files/assignment2.pdf" }
                ]
            }
        ]
    },
    notes: [
        {
            id: "note_1",
            title: "First Day Notes",
            content: "Important points from the first lecture: course requirements, grading policy, and office hours.",
            date: "2023-09-01"
        },
        {
            id: "note_2",
            title: "Programming Tips",
            content: "Remember to use proper indentation and meaningful variable names for better code readability.",
            date: "2023-09-10"
        }
    ]
};

export default sampleSubject; 
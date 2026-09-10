
students = {
    "Jay": 90,
    "Mark": 85,
    "John": 92
}

while True:
    print("\n===== STUDENT MANAGEMENT SYSTEM =====")
    print("1. Add Student")
    print("2. Remove Student")
    print("3. Search Student")
    print("4. Display Students")
    print("5. Show Average")
    print("6. Show Highest Grade")
    print("7. Exit")

    choice = input("Enter your choice: ")


    if choice == "1":
        name = input("Enter student name: ")
        grade = float(input("Enter grade: "))

        students[name] = grade
        print("Student added successfully!")


    elif choice == "2":
        name = input("Enter student name to remove: ")

        if name in students:
            del students[name]
            print("Student removed successfully!")
        else:
            print("Student not found.")


    elif choice == "3":
        name = input("Enter student name to search: ")

        if name in students:
            print(name, "has a grade of", students[name])
        else:
            print("Student not found.")


    elif choice == "4":
        print("\n===== STUDENT LIST =====")

        for name, grade in students.items():
            print(name, ":", grade)


    elif choice == "5":
        if len(students) > 0:
            average = sum(students.values()) / len(students)
            print("Average Grade:", average)
        else:
            print("No students available.")


    elif choice == "6":
        if len(students) > 0:
            highest = max(students.values())
            print("Highest Grade:", highest)

            for name, grade in students.items():
                if grade == highest:
                    print("Student:", name)
        else:
            print("No students available.")


    elif choice == "7":
        print("Program ended. Goodbye!")
        break

    else:
        print("Invalid choice. Please try again.")
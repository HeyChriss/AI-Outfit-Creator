# DrippedUp - Your AI-Powered Outfit Picker

[![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)](https://github.com/your-github-username/DrippedUp)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

DrippedUp is a collaborative full-stack web application designed to revolutionize how users choose their outfits. By allowing users to upload images of their existing clothing, our application leverages a fine-tuned machine learning model from Hugging Face to analyze these items and provide personalized outfit suggestions. Say goodbye to decision fatigue and hello to a more stylish and efficient wardrobe experience!

## Problem Statement

Many individuals face the daily challenge of deciding what to wear. This often leads to wasted time, uncertainty about their appearance, and potentially unnecessary clothing purchases due to a lack of inspiration in utilizing their current wardrobe effectively.

## Our Solution

DrippedUp offers a personal digital stylist by:

* **Digital Wardrobe:** Enabling users to build a digital representation of their closet by uploading clothing images.
* **AI-Powered Analysis:** Utilizing a fine-tuned machine learning model to identify garment types, colors, and potentially styles from uploaded images.
* **Intelligent Outfit Recommendations:** Suggesting outfit combinations based on the user's digital wardrobe, considering factors like color coordination, garment type compatibility, and potential user-defined style preferences.

Our approach differentiates itself by focusing on a personalized experience derived from analyzing the user's *own* clothing, offering a more tailored and less manual solution compared to existing alternatives.

## Real-World Impact

DrippedUp aims to:

* **Empower Users:** Help individuals make the most of their existing clothes.
* **Save Time and Reduce Decision Fatigue:** Streamline the outfit selection process.
* **Foster Style Creativity:** Encourage users to explore new and stylish combinations.
* **Promote Sustainable Consumption:** Potentially reduce the urge to buy unnecessary clothing.

## Target Audience

The primary audience for DrippedUp is individuals aged 18-45 who are interested in improving their style, simplifying their outfit choices, and discovering new ways to wear their clothes. This includes students, young professionals, and fashion enthusiasts globally, as the application will be accessible via the web.

## Key Features (For Initial Demo)

* **User Authentication:** Secure login and registration for personalized wardrobes.
* **Image Upload:** Functionality for users to upload images of their clothing items.
* **Garment Identification:** Integration with a fine-tuned Hugging Face ML model for basic garment analysis (type, color).
* **Digital Wardrobe Storage:** Secure storage of user clothing data in [Specify Database: e.g., AWS or MongoDB].
* **Basic Outfit Recommendations:** A rudimentary engine suggesting simple two-piece outfits based on garment type and color.
* **User Interface:** A basic front-end interface (likely using React) to display these features.

## Technology Stack

* **Front-end:** React
* **Back-end:** [Specify Backend Framework: e.g., Python/Flask, Node.js/Express]
* **Database:** [Specify Database: e.g., AWS (DynamoDB, RDS), MongoDB]
* **Machine Learning:** Fine-tuned model from Hugging Face (using TensorFlow or PyTorch)
* **Development Environment:** Python, Node.js, npm/yarn, IDE (VS Code, PyCharm, WebStorm), Git

## Installation (For Developers)

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-github-username/DrippedUp.git](https://github.com/your-github-username/DrippedUp.git)
    cd DrippedUp
    ```
2.  Install front-end dependencies:
    ```bash
    cd frontend
    npm install # or yarn install
    ```
3.  Install back-end dependencies:
    ```bash
    cd backend
    pip install -r requirements.txt # or equivalent for your backend framework
    ```
4.  **Download the model weights:**
    - Download the model weights file from [this Google Drive link](https://drive.google.com/file/d/1DfK51Fbcj2SvLx2ruIRP0DeVpPQP2bdg/view?usp=sharing).
    - Place the downloaded weights file (e.g., `model.keras`) in the `backend` directory or your preferred location.
5.  **Configure environment variables:**
    - Create a `.env` file in the `backend` directory (if it doesn't exist).
    - Add the following line to your `.env` file, updating the path if you placed the weights elsewhere:
      ```env
      MODEL_WEIGHTS_PATH=backend/model.keras
      ```
6.  Set up the database:
    * [Provide specific instructions for setting up your chosen database (e.g., AWS configuration, MongoDB Atlas setup).]
7.  Run the development servers:
    ```bash
    # For the front-end
    cd frontend
    npm start # or yarn start

    # In a separate terminal, for the back-end
    cd backend
    # Command to run your backend (e.g., python app.py, npm run dev)
    ```

## Usage (Anticipated User Workflow)

1.  **Sign Up/Log In:** Create a new account or log in to an existing one.
2.  **Upload Clothing:** Upload images of your clothing items. The application will guide you through the process.
3.  **Automatic Tagging (Initial):** The AI model will automatically attempt to identify the garment type and color. Users may have the option to confirm or edit these tags in future iterations.
4.  **Explore Outfit Recommendations:** Navigate to the outfit recommendation section to see suggested combinations based on your uploaded wardrobe.
5.  **Provide Feedback (Future):** Users may be able to provide feedback on the suggestions to further personalize the recommendations.

## Project Structure

```text
DrippedUp/
├── drippedup/
│   ├── backend/
│   │   ├── requirements.txt
│   │   ├── model_loader.py
│   │   ├── model.keras
│   │   ├── shirt.webp
│   │   └── drippedupenv/         # Python virtual environment (not needed in version control)
│   ├── src/
│   │   ├── App.css
│   │   ├── NewItem.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── supabaseClient.js
│   │   ├── vite-env.d.ts
│   │   ├── main.tsx
│   │   └── assets/
│   ├── public/
│   │   └── vite.svg
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.node.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── index.html
│   ├── eslint.config.js
│   └── README.md
├── LICENSE
└── README.md
```

## Team Members

* **Brandon Ansbergs** - [Ans22004@byui.edu](mailto:Ans22004@byui.edu)
* **Chris Mijangos** - [Mijq17001@byui.edu](mailto:Mij17001@byui.edu)

## Stakeholders

* **Jon Jensen** - [Jensenjon@byui.edu](mailto:Jensenjon@byui.edu) (Professor)
* **(Potentially) Users for Testing** - Friends and family interested in fashion

## Project Significance

DrippedUp is a significant project that involves:

* **Full-Stack Development:** Building a complete web application from front-end to back-end.
* **AI Integration:** Integrating and fine-tuning a sophisticated machine learning model for a practical application.
* **Collaboration:** Requiring effective teamwork and communication.

This project will demonstrate our ability to work with cutting-edge technologies, design scalable applications, and solve real-world challenges collaboratively, making it a valuable addition to our portfolios.

## New Computer Science Concepts We Will Learn

* Advanced concepts of our chosen full-stack web framework (React and [Backend Framework]).
* Fine-tuning pre-trained machine learning models using TensorFlow or PyTorch.
* Integration of the fine-tuned ML model into the back-end of a web application.
* Database management and interaction with [Specify Database Technology].
* Collaborative software development practices using Git and project management tools.

## Project Milestones

* [ ] Successful setup and basic fine-tuning of the Hugging Face ML model.
* [ ] Implementation of user authentication and image upload functionality.
* [ ] Functional back-end API for processing images and interacting with the ML model.
* [ ] Successful storage of user wardrobes in [Specify Database].
* [ ] A working basic outfit recommendation engine.
* [ ] A user-friendly front-end interface displaying core functionalities.
* [ ] Successful deployment of the application.

## Resources

**Software:**

* Python (Free)
* Node.js (Free)
* React (Free)
* [Specify Backend Framework] (Free)
* [Specify Database] (Potentially free tiers available)
* TensorFlow or PyTorch (Free)
* Web browser (Free)
* IDE (VS Code, PyCharm, WebStorm) (Free or student licenses)
* Git (Free)

**Online Resources:**

* Hugging Face Model Documentation: [Link to relevant documentation]
* Documentation for React, [Backend Framework], and [Database]
* Online tutorials and courses (YouTube, Coursera, Udemy - prioritize free options initially)
* Stack Overflow and other developer communities
* [Specify Database] free tier documentation (if applicable)

**Potential Costs:**

* More advanced tiers of [Specify Database] if free tier limitations are reached.
* Potential costs for more advanced online learning resources if needed.

## Dependencies

* **Software Installation:** Python, pip, Node.js, npm/yarn, React, [Backend Framework], [Database Client], TensorFlow/PyTorch, IDE, Git.
* **Platform:** Personal computers (Windows/Mac/Linux) for development. Deployment platform will depend on the chosen back-end and database (e.g., AWS EC2, AWS Amplify, Heroku, MongoDB Atlas).
* **API Access:** Reliable internet connection for accessing Hugging Face and potentially [Specify Database] services.
* **Collaboration:** Consistent communication and effective teamwork between Brandon and Chris.

## Risks and Challenges

* Challenges in fine-tuning the Hugging Face ML model for accurate clothing identification and stylistic compatibility.
* Complexity of integrating the ML model into a robust and scalable web application.
* Potential difficulties in learning and implementing the chosen front-end (React) and back-end frameworks concurrently.
* Database design challenges for efficient data storage and retrieval.
* Effective collaboration and division of tasks between team members.
* Time management to complete all aspects of the project within the semester timeframe.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Contact:**

* Brandon Ansbergs - [Ans22004@byui.edu](mailto:Ans22004@byui.edu)
* Chris Mijangos - [Mij17001@byui.edu](mailto:Mij17001@byui.edu)
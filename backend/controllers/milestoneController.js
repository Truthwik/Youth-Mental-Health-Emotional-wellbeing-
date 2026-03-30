import { User, Youth } from '../models/User.js';

// Get current user's milestones
export const getMilestones = async (req, res) => {
  const user = await Youth.findById(req.user._id);

  if (user) {
    res.json(user.milestones);
  } else {
    res.status(404).json({ message: 'User not found or not a youth user' });
  }
};

// Update a specific milestone as completed
export const updateMilestone = async (req, res) => {
  const { id, data } = req.body;
  const user = await Youth.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const milestoneIndex = user.milestones.findIndex(m => m.id === id);

  if (milestoneIndex === -1) {
    // If it doesn't exist, create it (for initial setup)
    user.milestones.push({ id, completed: true, completedAt: new Date(), data });
  } else {
    user.milestones[milestoneIndex].completed = true;
    user.milestones[milestoneIndex].completedAt = new Date();
    user.milestones[milestoneIndex].data = data;
  }

  // Trigger analysis if all milestones are complete
  const requiredMilestones = ['breathing', 'meditation', 'talking_to_friend', 'mood_check', 'anxiety_test'];
  const completedCount = user.milestones.filter(m => m.completed).length;

  if (completedCount >= requiredMilestones.length) {
    // Advanced Analysis Logic
    const meditation = user.milestones.find(m => m.id === 'meditation');
    const sharing = user.milestones.find(m => m.id === 'talking_to_friend');
    const moodCheck = user.milestones.find(m => m.id === 'mood_check');
    const anxietyTest = user.milestones.find(m => m.id === 'anxiety_test');
    
    let score = 0; // 0 is baseline/good, higher indicates possible 'problem'
    let specificConcerns = [];

    // Evaluate Meditation Mood
    if (meditation?.data?.mood === 'anxious') {
        score += 2;
        specificConcerns.push("higher levels of anxiety");
    } else if (meditation?.data?.mood === 'restless') {
        score += 1;
        specificConcerns.push("general restlessness");
    }

    // Evaluate Reflection Text (Simplified Sentiment)
    const text = (sharing?.data?.thought || "").toLowerCase();
    const crisisKeywords = ['hurt', 'end', 'hopeless', 'suicide', 'die', 'kill', 'dark'];
    const stressKeywords = ['stress', 'hard', 'tired', 'exam', 'pressure', 'lonely', 'sad'];

    if (crisisKeywords.some(kw => text.includes(kw))) {
        score += 5;
        specificConcerns.push("intense emotional distress or crisis thoughts");
    } else if (stressKeywords.some(kw => text.includes(kw))) {
        score += 1;
        specificConcerns.push("significant daily stress or isolation");
    }

    // Evaluate Mood Check (Sleep/Energy)
    if (moodCheck?.data?.sleep === 'poor' || moodCheck?.data?.energy === 'low') {
        score += 1;
        specificConcerns.push("low energy or sleep issues");
    }

    // Evaluate Anxiety Test (Scoring)
    const anxietyScore = (anxietyTest?.data?.q1 || 0) + (anxietyTest?.data?.q2 || 0);
    if (anxietyScore >= 4) {
        score += 3;
        specificConcerns.push("clinically significant anxiety symptoms");
    } else if (anxietyScore >= 2) {
        score += 1;
        specificConcerns.push("mild anxiety symptoms");
    }

    // Compose Result
    let analysisResult = "";
    if (score >= 5) {
        analysisResult = "Our assessment indicates you may be going through a very difficult time right now. We strongly encourage you to connect with one of our professional therapists in the Mentorship section immediately. Your safety and wellbeing are our top priority.";
    } else if (score >= 2) {
        analysisResult = "You've shown great dedication by completing these exercises. The results suggest you're feeling quite overwhelmed lately. Connecting with a peer mentor or trying our daily grounding mini-games could provide the relief you need.";
    } else {
        analysisResult = "Fantastic work! Your responses show a strong sense of self-awareness and emotional resilience. Keep practicing these mindfulness techniques to maintain your mental wellbeing. You're doing great!";
    }

    user.analysis = {
      result: analysisResult,
      generatedAt: new Date()
    };
  }

  await user.save();
  res.json({ milestones: user.milestones, analysis: user.analysis });
};

// Get the analysis result
export const getAnalysis = async (req, res) => {
  const user = await Youth.findById(req.user._id);

  if (user) {
    res.json(user.analysis);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import FileUploader from '../components/FileUploader';
import { UploadedProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const upsertCandidate = useMutation(api.candidates.upsertCandidate);
  const replaceJobExperiences = useMutation(api.jobExperiences.replaceJobExperiences);
  const replaceQuestions = useMutation(api.questions.replaceQuestions);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const profileData = JSON.parse(text) as UploadedProfile;

      // Upsert candidate (create or update)
      const candidateId = await upsertCandidate({
        email: profileData.email,
        password: profileData.password,
        profileType: profileData.profileType,
        cvUploaded: profileData.cvUploaded,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        eligibilityToWork: profileData.eligibilityToWork,
        age: profileData.age,
        postCode: profileData.postCode,
        birthdate: profileData.birthdate,
        phone: profileData.phone,
        country: profileData.country,
        county: profileData.county,
        salary: profileData.salary,
        profileSummary: profileData.profileSummary,
        currentJobTitle: profileData.currentJobTitle,
        currentCompany: profileData.currentCompany,
        experience: profileData.experience,
      });

      // Replace job experiences
      if (profileData.jobExperiences && profileData.jobExperiences.length > 0) {
        await replaceJobExperiences({
          candidateId,
          experiences: profileData.jobExperiences.map(exp => ({
            company: exp.company,
            title: exp.title,
            currentJob: exp.currentJob,
            startDate: exp.startDate,
            endDate: exp.endDate,
            scope: exp.scope,
          })),
        });
      }

      // Replace questions
      if (profileData.questions && profileData.questions.length > 0) {
        await replaceQuestions({
          candidateId,
          questions: profileData.questions.map(q => ({
            questionId: q.questionId || q._id || '',
            name: q.name,
            answer: q.answer,
            intent: q.intent,
            answered: q.answered,
            questionType: q.questionType,
            options: q.options,
          })),
        });
      }

      // Log in the user
      login({
        _id: candidateId,
        email: profileData.email,
        password: profileData.password,
        profileType: profileData.profileType,
        cvUploaded: profileData.cvUploaded,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        eligibilityToWork: profileData.eligibilityToWork,
        age: profileData.age,
        postCode: profileData.postCode,
        birthdate: profileData.birthdate,
        phone: profileData.phone,
        country: profileData.country,
        county: profileData.county,
        salary: profileData.salary,
        profileSummary: profileData.profileSummary,
        currentJobTitle: profileData.currentJobTitle,
        currentCompany: profileData.currentCompany,
        experience: profileData.experience,
      });

      showToast('Profile uploaded successfully!', 'success');
      void navigate('/jobs');
    } catch {
      showToast('Error processing file. Please check the format.', 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="inline-block px-4 py-1 text-xs font-mono tracking-wider text-orange-500 border border-orange-500/30 rounded-full bg-orange-500/10">
              [BETA] THE MOST MODERN JOB APPLICATION INFRASTRUCTURE
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
            The AI job
            <br />
            application agent
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Repetitive applications are dead. Job Use empowers anyone to automate job applications,
            no barriers. Simply upload your profile and let AI do the work.
          </p>
        </div>

        {isProcessing ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-500 font-mono text-sm">PROCESSING YOUR PROFILE...</p>
          </div>
        ) : (
          <FileUploader
            onFileUpload={(file) => void handleFileUpload(file)}
            minimal={true}
          />
        )}
      </div>
    </div>
  );
};

export default LandingPage;
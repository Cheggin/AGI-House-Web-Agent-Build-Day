import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import FileUploader from '../components/FileUploader';
import { UploadedProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const UploadProfile: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [profileData, setProfileData] = useState<UploadedProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'upload' | 'review'>('upload');

  const upsertCandidate = useMutation(api.candidates.upsertCandidate);
  const replaceJobExperiences = useMutation(api.jobExperiences.replaceJobExperiences);
  const replaceQuestions = useMutation(api.questions.replaceQuestions);

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text) as UploadedProfile;
      setProfileData(data);
      setStep('review');
    } catch {
      showToast('Error parsing JSON file. Please check the format.', 'error');
    }
  };

  const handleConfirmUpload = async () => {
    if (!profileData) return;

    setIsLoading(true);
    try {
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
      void navigate('/profile');
    } catch {
      showToast('Error uploading profile. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-xs font-mono text-orange-500 border border-orange-500/30 rounded-full bg-orange-500/10 mb-4">
            PROFILE UPLOAD
          </span>
          <h1 className="text-3xl font-bold">
            Upload Your Profile
          </h1>
          <p className="mt-2 text-gray-500">
            Import your professional data to get started
          </p>
        </div>

        {step === 'upload' ? (
          <div className="bg-gray-950 border border-gray-900 rounded-lg p-8">
            <FileUploader onFileUpload={(file) => void handleFileUpload(file)} />

            <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <h3 className="text-sm font-mono text-orange-500 mb-2 uppercase tracking-wider">
                Expected Format
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Your JSON file should include:
              </p>
              <ul className="text-xs text-gray-600 space-y-1 font-mono">
                <li>→ Personal information (firstName, lastName, email, phone)</li>
                <li>→ Professional details (currentJobTitle, currentCompany)</li>
                <li>→ Job experiences array</li>
                <li>→ Profile summary and salary expectations</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-gray-950 border border-gray-900 rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              Review Your Profile
            </h2>

            {profileData && (
              <div className="space-y-6">
                <div className="border-b border-gray-900 pb-4">
                  <h3 className="text-sm font-mono text-gray-500 mb-3 uppercase tracking-wider">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-mono text-xs text-gray-600">NAME</span>
                      <p className="text-white">{profileData.firstName} {profileData.lastName}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs text-gray-600">EMAIL</span>
                      <p className="text-white">{profileData.email}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs text-gray-600">PHONE</span>
                      <p className="text-white">{profileData.phone}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs text-gray-600">LOCATION</span>
                      <p className="text-white">{profileData.county}, {profileData.country}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-900 pb-4">
                  <h3 className="text-sm font-mono text-gray-500 mb-3 uppercase tracking-wider">
                    Professional Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-mono text-xs text-gray-600">CURRENT TITLE</span>
                      <p className="text-white">{profileData.currentJobTitle}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs text-gray-600">COMPANY</span>
                      <p className="text-white">{profileData.currentCompany}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs text-gray-600">EXPERIENCE</span>
                      <p className="text-white">{profileData.experience} years</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs text-gray-600">EXPECTED SALARY</span>
                      <p className="text-white">${profileData.salary}</p>
                    </div>
                  </div>
                </div>

                {profileData.profileSummary && (
                  <div className="border-b border-gray-900 pb-4">
                    <h3 className="text-sm font-mono text-gray-500 mb-3 uppercase tracking-wider">
                      Profile Summary
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {profileData.profileSummary}
                    </p>
                  </div>
                )}

                {profileData.jobExperiences && profileData.jobExperiences.length > 0 && (
                  <div>
                    <h3 className="text-sm font-mono text-gray-500 mb-3 uppercase tracking-wider">
                      Work Experience
                    </h3>
                    <div className="space-y-3">
                      {profileData.jobExperiences.map((exp, index) => (
                        <div key={index} className="bg-gray-900 border border-gray-800 p-3 rounded-lg">
                          <p className="font-medium text-white">{exp.title}</p>
                          <p className="text-sm text-orange-500">{exp.company}</p>
                          <p className="text-xs text-gray-600 font-mono mt-1">
                            {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep('upload')}
                    className="px-6 py-2 text-gray-400 bg-gray-900 border border-gray-800 rounded-full hover:bg-gray-800 transition-colors"
                    disabled={isLoading}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => void handleConfirmUpload()}
                    disabled={isLoading}
                    className="px-6 py-2 text-black bg-orange-500 rounded-full hover:bg-orange-400 transition-all transform hover:scale-105 disabled:opacity-50"
                  >
                    {isLoading ? 'Uploading...' : 'Confirm Upload'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProfile;
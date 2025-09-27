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

  const createCandidate = useMutation(api.candidates.createCandidate);
  const createBulkJobExperiences = useMutation(api.jobExperiences.createBulkJobExperiences);
  const createBulkQuestions = useMutation(api.questions.createBulkQuestions);

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
      const candidateId = await createCandidate({
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
        await createBulkJobExperiences({
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
        await createBulkQuestions({
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
      void navigate('/jobs');
    } catch {
      showToast('Error uploading profile. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Upload Your Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Upload your profile data to get started with your job applications
          </p>
        </div>

        {step === 'upload' ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <FileUploader onFileUpload={(file) => void handleFileUpload(file)} />

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Expected JSON Format
              </h3>
              <p className="text-sm text-blue-700 mb-2">
                Your JSON file should include the following fields:
              </p>
              <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                <li>Personal information (firstName, lastName, email, phone)</li>
                <li>Professional details (currentJobTitle, currentCompany, experience)</li>
                <li>Job experiences array with company, title, dates, and responsibilities</li>
                <li>Profile summary and salary expectations</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Review Your Profile
            </h2>

            {profileData && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Name:</span>
                      <p className="text-gray-900">{profileData.firstName} {profileData.lastName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Email:</span>
                      <p className="text-gray-900">{profileData.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Phone:</span>
                      <p className="text-gray-900">{profileData.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Location:</span>
                      <p className="text-gray-900">{profileData.county}, {profileData.country}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Professional Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Current Title:</span>
                      <p className="text-gray-900">{profileData.currentJobTitle}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Current Company:</span>
                      <p className="text-gray-900">{profileData.currentCompany}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Experience:</span>
                      <p className="text-gray-900">{profileData.experience} years</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Expected Salary:</span>
                      <p className="text-gray-900">${profileData.salary}</p>
                    </div>
                  </div>
                </div>

                {profileData.profileSummary && (
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Profile Summary
                    </h3>
                    <p className="text-sm text-gray-700">
                      {profileData.profileSummary}
                    </p>
                  </div>
                )}

                {profileData.jobExperiences && profileData.jobExperiences.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Work Experience
                    </h3>
                    <div className="space-y-3">
                      {profileData.jobExperiences.map((exp, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900">{exp.title}</p>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                          <p className="text-xs text-gray-500">
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
                    className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    disabled={isLoading}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => void handleConfirmUpload()}
                    disabled={isLoading}
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
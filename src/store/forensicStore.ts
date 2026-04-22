import { create } from 'zustand';

interface ForensicState {
  uploadedFile: File | null;
  analysisResult: any | null;
  setUploadedFile: (file: File | null) => void;
  setAnalysisResult: (result: any | null) => void;
  resetState: () => void;
}

export const useForensicStore = create<ForensicState>((set) => ({
  uploadedFile: null,
  analysisResult: null,
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  resetState: () => set({ uploadedFile: null, analysisResult: null }),
}));

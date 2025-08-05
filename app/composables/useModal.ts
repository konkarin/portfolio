import { ref, inject, type Ref } from 'vue'

export interface PhotoModalData {
  url: string
  show: boolean
  exif: object
}

export interface ModalState {
  photoModal: Ref<PhotoModalData>
  switchPhotoModal: (modalData: PhotoModalData) => void
}

export const useModal = (): ModalState => {
  const photoModal = ref<PhotoModalData>({
    url: '',
    show: false,
    exif: {},
  })

  const switchPhotoModal = (modalData: PhotoModalData): void => {
    photoModal.value = modalData
  }

  return {
    photoModal,
    switchPhotoModal,
  }
}

export const MODAL_KEY = Symbol('modal')

export const useModalInject = (): ModalState => {
  const modal = inject<ModalState>(MODAL_KEY)
  if (!modal) {
    throw new Error('useModalInject must be used within a ModalProvider')
  }
  return modal
}

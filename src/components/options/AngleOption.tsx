import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { type OptionList, type Option } from "../../types/UserSetting";

const OptionContainer = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StyledH2 = styled.h2`
  font-size: 2rem;
  color: #34495e;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #fcfcfc;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input {
    padding: 0.8rem 1rem;
    border: 1px solid #dcdcdc;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s ease-in-out;

    &:focus {
      outline: none;
      border-color: #a0d4ff;
    }
  }
`;

const StyledButton = styled.button`
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PrimaryButton = styled(StyledButton)`
  background-color: #f0ad4e;
  color: #ffffff;

  &:hover {
    background-color: #ec971f;
  }
`;

const SecondaryButton = styled(StyledButton)`
  background-color: #6c757d;
  color: #ffffff;
  margin-left: 0.8rem;

  &:hover {
    background-color: #5a6268;
  }
`;

const DeleteButton = styled(StyledButton)`
  background-color: #dc3545;
  color: #ffffff;

  &:hover {
    background-color: #c82333;
  }
`;

const EditButton = styled(StyledButton)`
  background-color: #007bff;
  color: #ffffff;
  margin-right: 0.8rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const SettingListSection = styled.div`
  background-color: #fdfdfd;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #e9e9e9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);

  h3 {
    font-size: 1.5rem;
    color: #495057;
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: 600;
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  margin-bottom: 0.8rem;
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-3px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingDetails = styled.div`
  flex-grow: 1;
  color: #333;
  line-height: 1.5;
  font-size: 1rem;

  strong {
    font-size: 1.15rem;
    color: #2c3e50;
  }
`;

const SettingActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

interface AngleOptionProps {
  option: OptionList;
}

export const AngleOption: React.FC<AngleOptionProps> = ({ option }) => {
  const [settingName, setSettingName] = useState<string>("");
  const [angleThreshold, setAngleThreshold] = useState<number>(
    (option.options && option.options[0]?.threshold) || 79
  );
  const [notificationThreshold, setNotificationThreshold] = useState<number>(
    (option.options && option.options[0]?.healthy_range) || 5
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing && option.options?.length > 0) {
      setAngleThreshold(option.options[0].threshold);
      setNotificationThreshold(option.options[0].healthy_range);
    }
  }, [option.options, isEditing]);

  const handleSubmit = () => {
    if (
      !settingName ||
      angleThreshold === undefined ||
      notificationThreshold === undefined
    ) {
      alert("모든 필드를 채워주세요!");
      return;
    }

    if (isEditing && editId) {
      alert("설정이 성공적으로 수정되었습니다! 😊");
    } else {
      alert("새 설정이 성공적으로 추가되었습니다! 😊");
    }

    setSettingName("");
    setAngleThreshold((option.options && option.options[0]?.threshold) || 79);
    setNotificationThreshold(
      (option.options && option.options[0]?.healthy_range) || 5
    );
    setIsEditing(false);
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("정말로 이 설정을 삭제하시겠습니까?")) {
      console.log(`설정 ID: ${id} 삭제 요청됨`);
      alert("설정이 삭제되었습니다! 🗑️");
    }
  };

  const handleEdit = (setting: Option) => {
    setSettingName(setting.name);
    setAngleThreshold(setting.threshold);
    setNotificationThreshold(setting.healthy_range);
    setIsEditing(true);
    setEditId(setting.name);
  };

  const handleCancelEdit = () => {
    setSettingName("");
    setAngleThreshold((option.options && option.options[0]?.threshold) || 79);
    setNotificationThreshold(
      (option.options && option.options[0]?.healthy_range) || 5
    );
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <OptionContainer>
      <StyledH2>{isEditing ? "설정 수정" : "새 설정 추가"}</StyledH2>

      <FormSection>
        <InputGroup>
          <label htmlFor="settingName">설정 이름:</label>
          <input
            type="text"
            id="settingName"
            value={settingName}
            onChange={(e) => setSettingName(e.target.value)}
            placeholder="예: 기본 설정, 회의용 설정"
          />
        </InputGroup>
        <InputGroup>
          <label htmlFor="angleThreshold">각도 임계값:</label>
          <input
            type="number"
            id="angleThreshold"
            value={angleThreshold}
            onChange={(e) => setAngleThreshold(Number(e.target.value))}
            min="0"
            max="180"
          />
        </InputGroup>
        <InputGroup>
          <label htmlFor="notificationThreshold">알림 임계값:</label>
          <input
            type="number"
            id="notificationThreshold"
            value={notificationThreshold}
            onChange={(e) => setNotificationThreshold(Number(e.target.value))}
            min="1"
            max="60"
          />
        </InputGroup>
        <div>
          <PrimaryButton type="button" onClick={handleSubmit}>
            {isEditing ? "설정 저장" : "새 설정 추가"}
          </PrimaryButton>
          {isEditing && (
            <SecondaryButton type="button" onClick={handleCancelEdit}>
              취소
            </SecondaryButton>
          )}
        </div>
      </FormSection>

      {option.options?.length > 0 && (
        <SettingListSection>
          <h3>저장된 설정 목록</h3>
          {option.options.map((opt) => (
            <SettingItem key={opt.name}>
              <SettingDetails>
                <strong>{opt.name}</strong>
                <br />
                각도 임계값: {opt.threshold}°
                <br />
                알림 임계값: {opt.healthy_range}분
              </SettingDetails>
              <SettingActions>
                <EditButton onClick={() => handleEdit(opt)}>수정</EditButton>
                <DeleteButton onClick={() => handleDelete(opt.name)}>
                  삭제
                </DeleteButton>
              </SettingActions>
            </SettingItem>
          ))}
        </SettingListSection>
      )}
    </OptionContainer>
  );
};

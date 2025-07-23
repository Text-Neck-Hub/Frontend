// src/components/Navbar.tsx

import React, { useState } from 'react'; // useState 훅 임포트
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// 1. 네비게이션 링크 아이템의 타입 정의
export interface NavLink {
    text: string;
    url: string;
    onClick?: () => void;
}

// 2. Navbar 컴포넌트가 받을 props의 타입 정의
interface NavbarProps {
    brandName?: string;
    links?: NavLink[];
}

// --- styled-components 정의 시작 ---

// 미디어 쿼리 Breakpoints (상수로 정의하여 재사용)
const breakpoints = {
    tablet: '768px',
    mobile: '480px',
};

// 네비게이션 바 전체 컨테이너
const StyledNav = styled.nav`
    background-color: #333;
    padding: 1rem;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    min-height: 60px;
    position: relative; /* 햄버거 메뉴 위치 지정을 위해 */
`;

// 로고/브랜드 이름 스타일 (Link 컴포넌트를 사용하며, 항상 "/"로 연결)
const StyledBrandLink = styled(Link)`
    color: white;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
    z-index: 2; /* 햄버거 메뉴 위에 보이도록 */

    &:hover {
        color: #ddd;
    }
`;

// 네비게이션 링크들 감싸는 ul 스타일
// 모바일에서는 숨기고, 토글되면 보이도록 합니다.
const StyledNavLinks = styled.ul<{ isOpen: boolean }>`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex; /* 데스크톱 기본 */

    @media (max-width: ${breakpoints.tablet}) {
        flex-direction: column;
        background-color: #333;
        position: absolute;
        top: 100%; /* 네비게이션 바 바로 아래 */
        left: 0;
        width: 100%;
        padding: 1rem 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')}; /* 햄버거 메뉴 토글 */
        z-index: 1; /* 콘텐츠 위에 보이도록 */
    }
`;

// 개별 링크 아이템 li 스타일
const StyledNavLinkItem = styled.li`
    margin-left: 1.5rem; /* 데스크톱에서 간격 */

    @media (max-width: ${breakpoints.tablet}) {
        margin: 0; /* 모바일에서 간격 제거 */
        width: 100%; /* 모바일에서 전체 너비 사용 */
        text-align: center;
        border-bottom: 1px solid #444; /* 모바일 메뉴 구분선 */
        &:last-child {
            border-bottom: none;
        }
    }
`;

// 링크 또는 버튼에 적용될 공통 스타일
const CommonLinkButtonStyles = `
    color: white;
    text-decoration: none;
    font-size: 1rem;
    padding: 0.5rem 0.8rem;
    cursor: pointer;
    font-family: inherit;
    background: none;
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    width: 100%; /* 모바일에서 버튼 너비 100% */
    display: block; /* 모바일에서 블록 레벨로 */

    &:hover {
        background-color: #555;
    }
`;

const StyledRouterLink = styled(Link)`
    ${CommonLinkButtonStyles}
`;

const StyledAnchor = styled.a`
    ${CommonLinkButtonStyles}
`;

const StyledButton = styled.button`
    ${CommonLinkButtonStyles}
`;

// 햄버거 메뉴 아이콘 스타일
const HamburgerIcon = styled.div`
    display: none; /* 데스크톱에서는 숨김 */
    font-size: 2rem;
    cursor: pointer;
    color: white;
    z-index: 2; /* 햄버거 메뉴 위에 보이도록 */

    @media (max-width: ${breakpoints.tablet}) {
        display: block; /* 태블릿/모바일에서 보임 */
    }
`;

// --- styled-components 정의 끝 ---

// Navbar 컴포넌트 정의
const Navbar: React.FC<NavbarProps> = ({ brandName = '우리 서비스', links = [] }) => {
    // 햄버거 메뉴의 열림/닫힘 상태를 관리합니다.
    const [isOpen, setIsOpen] = useState(false);

    // 햄버거 메뉴 토글 함수
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <StyledNav>
            {/* 브랜드 또는 로고 부분 */}
            <StyledBrandLink to="/">
                {brandName}
            </StyledBrandLink>

            {/* 햄버거 메뉴 아이콘 */}
            <HamburgerIcon onClick={toggleMenu}>
                &#9776; {/* 햄버거 아이콘 (유니코드 문자) */}
            </HamburgerIcon>

            {/* 네비게이션 링크 부분 */}
            <StyledNavLinks isOpen={isOpen}> {/* isOpen prop을 전달 */}
                {links.map((link: NavLink, index: number) => (
                    <StyledNavLinkItem key={index} onClick={() => setIsOpen(false)}> {/* 메뉴 클릭 시 닫히도록 */}
                        {link.onClick ? (
                            <StyledButton onClick={link.onClick}>
                                {link.text}
                            </StyledButton>
                        ) : link.url.startsWith('/') ? (
                            <StyledRouterLink to={link.url}>
                                {link.text}
                            </StyledRouterLink>
                        ) : (
                            <StyledAnchor href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.text}
                            </StyledAnchor>
                        )}
                    </StyledNavLinkItem>
                ))}
            </StyledNavLinks>
        </StyledNav>
    );
};

// defaultProps (유지보수 및 가독성을 위해)

export default Navbar;
# <span style="color:orange"> 단짠맛집 </span>

배포 URL : https://sweetsalty.shop

팀 노션 : [![](https://velog.velcdn.com/images/yukina1418/post/cc1e69ee-6376-4fb6-8ff5-ab3b7ecd0068/image.svg)](https://www.notion.so/dingco/8-79bf71f71eac424fac275e09407115fd)

#### 목차

1. [실행 방법](#실행-방법)
2. [기획의도](#기획-의도)   
3. [팀원소개](#팀원-소개)   
4. [기술스택](#기술-스택)   
5. [ERD](#erd)
6. [Api Docs](#api-docs)
7. [환경변수](#env-환경변수)

## 실행 방법

목차 7번의 env 파일 구성요소를 전부 추가한 후 <br>
docker-compose build -> docker-compose up <br>
http://localhost:3000/graphql 에서 확인

## 기획 의도

Youtube에 의하여 정보매체가 주가 되어버린 현재, 최근들어 <br>
네이버블로그 등의 텍스트 매체를 다시 사용하길 원하는 니즈가 있는 것을 확인했습니다.

또한 가짜 정보 혹은 원치 않는 정보가 많은 인터넷 세상 속에서 원하는 정보만을 골라서 찾을 수 있기를 원했고 <br>
그래서 생각한 것이 제가 좋아하는 음식을 기준으로 리뷰를 적는 사이트를 만들어보자! 였습니다.

기존에 있던 망고 플레이트, 다이닝 코드, 식신과 같은 사이트는 매장이 주가 되거나 크롤링에 의한 사이트였다면 <br>
제가 생각한 사이트는 직접적으로 사용자들이 식당을 평가하고 자유롭게 커뮤니티같은 사이트를 구성하길 원했고 <br>
최근 코로나로 인하여 소상공인분들께서 큰 피로감을 가지고 있는 것도 고려하여 <br>
상대적으로 홍보를 하기 힘든 소상공인의 부담을 줄일 수 있는 컨텐츠도 담아보았습니다.

## 팀원 소개

![](https://velog.velcdn.com/images/yukina1418/post/46fa979d-1ef1-4830-b331-bb7b6f8aff63/image.png)

![](https://velog.velcdn.com/images/yukina1418/post/7a983632-af4b-4e21-a24d-844ca2a7f16e/image.png)

## 기술 스택

![](https://velog.velcdn.com/images/yukina1418/post/f34d612c-4cf9-4f8d-8306-e775556943e5/image.png)

## ERD

![](https://velog.velcdn.com/images/yukina1418/post/01b2e9d2-88b1-4a99-8c47-2246b7fc5a16/image.png)

## Api Docs

![](https://velog.velcdn.com/images/yukina1418/post/d7098b91-774d-4f87-9afc-d9132991e3af/image.png)

## env 환경변수

|환경변수 이름|넣어야할 값| 설명|
|------|---|--------|
|ACCESS|액세스토큰 시크릿키|로그인|
|REFRESH|리프레시토큰 시크릿키|-|
|SMS_APP_KEY|NHN 클라우드 앱 키|인증번호 발송|
|SMS_X_SECRET_KEY|NHN 클라우드 시크릿 키|-|
|SMS_SENDER|NHN 클라우드 발송번호|-|
|IMP_KEY|아임포트 키|결제|
|IMP_SECRET|아임포트 시크릿 키|-|
|STORAGE_BUCKET|GCP 버켓|이미지 업로드|
|STORAGE_KEY_FILENAME|GCP 유저 json 파일|-|
|STORAGE_PROJECT_ID|GCP 프로젝트 아이디|-|
|REDIRECT_URL| 리다이렉트 URL | 소셜 로그인 |
|GOOGLE_CLIENT_ID| OAuth 클라이언트 아이디| -|
|GOOGLE_CLIENT_SECRET| OAuth 구글 시크릿 키| -|
|KAKAO_CLIENT_ID| OAuth 카카오 클라이언트 아이디| -|
|KAKAO_CLIENT_SECRET| OAuth 카카오 시크릿 키 |-|
|NAVER_CLIENTID| OAuth 네이버 클라이언트 아이디|-|
|NAVER_CLIENTSECRET| OAuth 네이버 시크릿 키|-|
|ELK_URL| 엘라스틱서치 URL| 검색엔진 사용, Module.ts 단|
|REDIS_URL| DB 접속 URL | Redis 사용,  app.module.ts 단|
|HOST| DB 호스트 이름|  MySQL 사용, app.module.ts 단|
|PORT|DB 포트|-|
|USERNAME| DB 유저 아이디| -|
|PASSWORD| DB 유저 비밀번호| -|
|DATABASE| DB 이름 | - |
|CORS_ORIGIN_DEV| CORS URL 개발용 | CORS, app.module.ts & main.ts|
|CORS_ORIGIN_TEST| CORS URL 테스트용| - |
|CORS_ORIGIN_PROD| CORS URL 배포용 | - |


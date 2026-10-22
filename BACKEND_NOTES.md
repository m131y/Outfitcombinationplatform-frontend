# 백엔드에 추가·수정하면 좋은 것들

프론트가 기대하는 API와, 지금 백엔드 코드를 보면서 발견한 문제를 정리했어요.
아래 1~4번을 추가하면 피드·상세·좋아요·옷장이 예시 데이터 대신 실제 데이터로 바뀝니다.
패키지 경로는 `com.my131.Outfitcombinationplatform_backend` 기준으로 생략해서 적었어요.

---

## 0. 꼭 고쳐야 하는 것

**`ClosetItemController` 가 서비스를 호출하지 않아요.** 지금은 아무것도 안 하고 204만 돌려줍니다.

```java
@PostMapping("/add/{clothingItemId}")
public ResponseEntity<Void> addClosetItem(@PathVariable Long clothingItemId) {
    closetItemService.addClosetItem(clothingItemId);
    return ResponseEntity.noContent().build();
}

@DeleteMapping("/delete/{closetItemId}")
public ResponseEntity<Void> deleteClosetItem(@PathVariable Long closetItemId) {
    closetItemService.deleteClosetItem(closetItemId);
    return ResponseEntity.noContent().build();
}
```

**`PUT /api/pictures/{id}`, `PUT /api/user/me/password` 에 `@RequestBody` 가 없어요.** 그래서 JSON 바디가 바인딩되지 않습니다.

```java
public ResponseEntity<PictureResponseDto> updatePicture(@PathVariable Long pictureId,
                                                        @RequestBody UpdatePictureDto updatePictureDto)

public ResponseEntity<Boolean> updatePassword(@Valid @RequestBody UpdatePasswordDto requestDto)
```

`PictureService.updatePicture` 는 `imageUrl` 을 DTO 값으로 덮어써서, 비어 오면 이미지가 사라져요.
프론트는 기존 `imageUrl` 을 같이 보내지만, 서버에서도 `null` 이면 건너뛰게 하는 편이 안전합니다.

**`LikeService.toggleLike` 에 `@Transactional` 이 필요해요.** 파생 삭제 쿼리(`deleteByUserAndPicture`)는 트랜잭션 없이 실행하면 예외가 납니다.

**`User.nickname` 이 `nullable = false` 인데 회원가입에서는 선택값이에요.** 프론트에서는 비어 있으면 아이디로 채워 보내고 있어요.

**아이템 업로드 시 옷 이미지가 비어요.** `ClothingItem.of(...)` 에 넘기는 `imageUrl` 로 업로드한 사진 URL을 쓰도록 `PictureService.uploadPicture` 의 ITEM 분기에서 `clothingItemDto.setImageUrl(imageUrl);` 을 먼저 해 주세요. 옷장 화면 썸네일이 이 값을 씁니다.

**확인 필요:** `UploadPictureDto`, `ClothingItemDto`, `LoginRequestDto` 는 `@Builder` 만 있고 기본 생성자가 없어요. 요청 JSON 역직렬화에서 400/500이 나면 `@NoArgsConstructor @AllArgsConstructor` 를 함께 붙여 주세요.

---

## 1. 공통 DTO

```java
// global/common/PageResponse.java
public record PageResponse<T>(List<T> content, int page, int size, boolean hasNext) {
    public static <T> PageResponse<T> of(Slice<T> slice) {
        return new PageResponse<>(slice.getContent(), slice.getNumber(), slice.getSize(), slice.hasNext());
    }
}
```

```java
// domain/clothing/dto/ClothingItemSummaryDto.java
public record ClothingItemSummaryDto(Long id, String name, String imageUrl, String brand, String purchaseUrl) {
    public static ClothingItemSummaryDto fromEntity(ClothingItem c) {
        return new ClothingItemSummaryDto(c.getId(), c.getName(), c.getImageUrl(), c.getBrand(), c.getPurchaseUrl());
    }
}
```

`PictureResponseDto` 에 `id`, `user`, `likedByMe`, `createdAt`, `clothingItem` 을 추가합니다. 상세 화면 이동, 작성자 표시, 내 사진 수정/삭제 판단, 좋아요 상태, 옷장에 담기에 필요해요.

```java
@Builder
@Data
public class PictureResponseDto {
    private Long id;
    private String description;
    private String imageUrl;
    private Long likesCount;
    private PictureType pictureType;
    private Set<String> styleTags;
    private UserSummaryDto user;
    private boolean likedByMe;
    private LocalDateTime createdAt;
    private ClothingItemSummaryDto clothingItem;

    public static PictureResponseDto fromEntity(Picture picture) {
        return fromEntity(picture, false, null);
    }

    public static PictureResponseDto fromEntity(Picture picture, boolean likedByMe, ClothingItem item) {
        return PictureResponseDto.builder()
                .id(picture.getId())
                .description(picture.getDescription())
                .imageUrl(picture.getImageUrl())
                .likesCount((long) picture.getLikes().size())
                .pictureType(picture.getPictureType())
                .styleTags(picture.getStyleTags())
                .user(UserSummaryDto.fromEntity(picture.getUser()))
                .likedByMe(likedByMe)
                .createdAt(picture.getCreatedAt())
                .clothingItem(item == null ? null : ClothingItemSummaryDto.fromEntity(item))
                .build();
    }
}
```

---

## 2. 피드 목록 / 상세 — `GET /api/pictures`, `GET /api/pictures/{id}`

태그로 검색하려면 `Picture.styleTags` 를 `ClothingItem` 처럼 컬렉션 테이블로 바꾸는 게 쿼리하기 편해요.

```java
// Picture.java
@Builder.Default
@ElementCollection
@CollectionTable(name = "picture_style_tags", joinColumns = @JoinColumn(name = "picture_id"))
@Column(name = "tag")
private Set<String> styleTags = new HashSet<>();
```

```java
// PictureRepository.java
public interface PictureRepository extends JpaRepository<Picture, Long> {
    @Query("""
        select distinct p from Picture p
        left join p.styleTags t
        where (:type is null or p.pictureType = :type)
          and (:userId is null or p.user.id = :userId)
          and (:tag is null or t = :tag)
        """)
    Slice<Picture> findFeed(@Param("type") PictureType type,
                            @Param("userId") Long userId,
                            @Param("tag") String tag,
                            Pageable pageable);
}

// PictureItemRepository.java
Optional<PictureItem> findFirstByPictureId(Long pictureId);

// LikeRepository.java
boolean existsByUserIdAndPictureId(Long userId, Long pictureId);
```

로그인 안 한 사람도 피드는 볼 수 있게, 현재 사용자를 "없으면 비움"으로 가져오는 메서드를 추가합니다.

```java
// AuthService.java
public Optional<User> findCurrentUser() {
    try {
        return Optional.of(getCurrentUser());
    } catch (RuntimeException e) {
        return Optional.empty();
    }
}
```

```java
// PictureService.java  (LikeRepository 주입 추가)
@Transactional(readOnly = true)
public PageResponse<PictureResponseDto> getFeed(PictureType type, String tag, Long userId, int page, int size) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), Sort.by(Sort.Direction.DESC, "createdAt"));
    Long meId = authService.findCurrentUser().map(User::getId).orElse(null);
    String tagParam = (tag == null || tag.isBlank()) ? null : tag.trim();
    Slice<Picture> slice = pictureRepository.findFeed(type, userId, tagParam, pageable);
    return PageResponse.of(slice.map(p -> toDto(p, meId)));
}

@Transactional(readOnly = true)
public PictureResponseDto getPicture(Long pictureId) {
    Picture picture = pictureRepository.findById(pictureId)
            .orElseThrow(() -> new ResourceNotFoundException("해당 사진을 찾을 수 없습니다."));
    Long meId = authService.findCurrentUser().map(User::getId).orElse(null);
    return toDto(picture, meId);
}

private PictureResponseDto toDto(Picture p, Long meId) {
    boolean liked = meId != null && likeRepository.existsByUserIdAndPictureId(meId, p.getId());
    ClothingItem item = p.getPictureType() == PictureType.ITEM
            ? pictureItemRepository.findFirstByPictureId(p.getId()).map(PictureItem::getClothingItem).orElse(null)
            : null;
    return PictureResponseDto.fromEntity(p, liked, item);
}
```

```java
// PictureController.java
@GetMapping
public ResponseEntity<ApiResponse<PageResponse<PictureResponseDto>>> getFeed(
        @RequestParam(required = false) PictureType type,
        @RequestParam(required = false) String tag,
        @RequestParam(required = false) Long userId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {
    return ResponseEntity.ok(ApiResponse.success(pictureService.getFeed(type, tag, userId, page, size)));
}

@GetMapping("/{pictureId}")
public ResponseEntity<ApiResponse<PictureResponseDto>> getPicture(@PathVariable Long pictureId) {
    return ResponseEntity.ok(ApiResponse.success(pictureService.getPicture(pictureId)));
}
```

목록에서 사진마다 좋아요/아이템을 따로 조회해서 N+1 이 생기지만, 처음엔 이대로 두고 데이터가 쌓이면 fetch join 이나 배치 조회로 바꾸면 돼요.

---

## 3. 좋아요 — `POST /api/pictures/{id}/like`

`LikeService` 는 이미 있으니 컨트롤러만 붙이면 됩니다. 응답: `{ liked: boolean, likesCount: number }`

```java
public record LikeResponseDto(boolean liked, Long likesCount) {}

// PictureController.java (LikeService 주입 추가)
@PostMapping("/{pictureId}/like")
public ResponseEntity<ApiResponse<LikeResponseDto>> toggleLike(@PathVariable Long pictureId) {
    boolean liked = likeService.toggleLike(pictureId);
    return ResponseEntity.ok(ApiResponse.success(new LikeResponseDto(liked, likeService.getLikeCount(pictureId))));
}
```

---

## 4. 내 옷장 조회 — `GET /api/closet/me`

```java
public record ClosetItemResponseDto(Long closetItemId, ClosetItemSource source, ClothingItemSummaryDto clothingItem) {
    public static ClosetItemResponseDto fromEntity(ClosetItem ci) {
        return new ClosetItemResponseDto(ci.getId(), ci.getSource(), ClothingItemSummaryDto.fromEntity(ci.getClothingItem()));
    }
}

// ClosetRepository.java
Optional<Closet> findByUserId(Long userId);

// ClosetService.java
@Transactional(readOnly = true)
public List<ClosetItemResponseDto> getMyCloset() {
    User user = authService.getCurrentUser();
    return closetRepository.findByUserId(user.getId())
            .map(c -> c.getItems().stream().map(ClosetItemResponseDto::fromEntity).toList())
            .orElse(List.of());
}

// ClosetController.java
@GetMapping("/me")
public ResponseEntity<ApiResponse<List<ClosetItemResponseDto>>> getMyCloset() {
    return ResponseEntity.ok(ApiResponse.success(closetService.getMyCloset()));
}
```

같은 아이템을 두 번 담지 않도록 `addClosetItem` 에서 `existsByClosetIdAndClothingItemId` 로 한 번 확인해 주면 좋아요.

---

## 5. 에러 응답 통일 (권장)

지금은 전역 예외 처리기가 없어서 예외가 대부분 500으로 나가고, 프론트에는 "서버에서 문제가 생겼어요"만 보여요.
아래처럼 `ApiResponse.error(message)` 로 내려주면 프론트가 그 메시지를 그대로 보여줍니다.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({BadRequestException.class, IllegalArgumentException.class, UserAlreadyExistsException.class})
    public ResponseEntity<ApiResponse<Void>> badRequest(RuntimeException e) {
        return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
    }

    @ExceptionHandler({AuthenticationException.class, UnauthorizedException.class, InvalidPasswordException.class,
                       org.springframework.security.core.AuthenticationException.class})
    public ResponseEntity<ApiResponse<Void>> unauthorized(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(e.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> notFound(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> invalid(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .findFirst().map(FieldError::getDefaultMessage).orElse("입력값을 확인해 주세요.");
        return ResponseEntity.badRequest().body(ApiResponse.error(msg));
    }
}
```

`ApiResponse` 형식(`success` 필드 포함)으로 온 404는 프론트가 "데이터 없음"으로 처리하고, Spring 기본 404(매핑 자체가 없음)만 "API 미구현 → 예시 데이터"로 처리해요.

그 밖에 `AuthService.signup` 에서 아이디 중복일 때도 메시지가 "동일한 email이 존재합니다." 로 되어 있어서 "동일한 아이디가 존재합니다." 로 바꾸면 좋겠어요.

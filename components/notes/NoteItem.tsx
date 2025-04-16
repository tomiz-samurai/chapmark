import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getRelativeTime } from '../../lib/utils/dateUtils';
import { Note } from '../../types/models';
import { colors, spacing, typography, shadows, borderRadius } from '../../constants/theme';

interface NoteItemProps {
  note: Note;
  onPress?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  showActions?: boolean;
}

/**
 * メモを表示するカードコンポーネント
 */
export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onPress,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress && onPress(note)}
    >
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>{note.content}</Text>
      </View>
      
      <View style={styles.metadataContainer}>
        <View style={styles.pageInfo}>
          {note.pageNumber && (
            <Text style={styles.metadataText}>P.{note.pageNumber}</Text>
          )}
          {note.tags && note.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {note.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        <Text style={styles.dateText}>
          {getRelativeTime(note.updatedAt)}
        </Text>
      </View>
      
      {showActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit && onEdit(note)}
          >
            <MaterialIcons name="edit" size={18} color={colors.gray[500]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete && onDelete(note)}
          >
            <MaterialIcons name="delete" size={18} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  noteContainer: {
    marginBottom: spacing.md,
  },
  noteText: {
    fontSize: typography.fontSize.md,
    lineHeight: 24,
    color: colors.gray[800],
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.sm,
  },
  pageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metadataText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginRight: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary.main,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  actionsContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: spacing.sm,
  },
}); 